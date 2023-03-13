package cn.winkt.modules.paimai.config;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import okhttp3.WebSocket;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.util.SpringContextUtils;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@Slf4j
@ServerEndpoint("/auction/websocket/{appId}/{userId}")
public class PaimaiWebSocket {
    private Session session;
    private String appId;
    private static final ConcurrentHashMap<String, CopyOnWriteArraySet<PaimaiWebSocket>> webSockets =new ConcurrentHashMap<>(100);
    private static final ConcurrentHashMap<String, Session> userSessionPool = new ConcurrentHashMap<>(1000);


    @OnOpen
    public void onOpen(Session session, @PathParam(value = "appId") String appId, @PathParam(value="userId") String userId) {
        try {
            String lock =  "CREATE-SOCKET-"+appId;
            RedissonLockClient redissonLockClient = redissonLockClient();
            if(redissonLockClient.tryLock(lock, 3)) {
                if(!webSockets.containsKey(appId)) {
                    webSockets.put(appId, new CopyOnWriteArraySet<>());
                }
                this.session = session;
                this.appId = appId;
                webSockets.get(appId).add(this);
                userSessionPool.put(userId, session);
                log.info("{}【websocket消息】有新的连接，总数为: {}", appId, webSockets.get(appId).size());
                redissonLockClient.unlock(lock);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
    @OnClose
    public void onClose() {
        try {
            String appId = this.appId;
            webSockets.get(appId).remove(this);
            log.info("{}【websocket消息】连接断开，总数为: {}", appId, webSockets.size());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @OnMessage
    public void onMessage(String message) {
        log.info("{}【websocket消息】收到客户端消息: {}", this.appId, message);
        JSONObject jsonObject = JSONObject.parseObject(message);
        String fromUserId = jsonObject.getString("fromUserId");
        if(StringUtils.isNotEmpty(fromUserId)) {
            if(userSessionPool.containsKey(fromUserId)) {
                JSONObject reply = new JSONObject();
                reply.put("type", "MSG_REPLY");
                reply.put("toUserId", fromUserId);
                userSessionPool.get(fromUserId).getAsyncRemote().sendText(JSONObject.toJSONString(reply));
            }
        }
    }

    // 此为广播消息
    public void sendAllMessage(String message) {
        log.info("{}【websocket消息】广播消息: {}", AppContext.getApp(), message);
        for(PaimaiWebSocket webSocket : webSockets.get(AppContext.getApp())) {
            try {
                if(webSocket.session.isOpen()) {
                    webSocket.session.getAsyncRemote().sendText(message);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    RedissonLockClient redissonLockClient() {
        return SpringContextUtils.getBean(RedissonLockClient.class);
    }
}
