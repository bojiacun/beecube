package cn.winkt.modules.paimai.config;

import lombok.extern.slf4j.Slf4j;
import okhttp3.WebSocket;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.util.SpringContextUtils;
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
@ServerEndpoint("/auction/websocket/{userId}")
public class PaimaiWebSocket {
    private Session session;
    private static CopyOnWriteArraySet<PaimaiWebSocket> webSockets =new CopyOnWriteArraySet<>();
    private static Map<String,Session> userSessionPool = new HashMap<String,Session>();


    @OnOpen
    public void onOpen(Session session, @PathParam(value="userId") String userId) {
        try {
            this.session = session;
            webSockets.add(this);
            userSessionPool.put(userId, session);
            log.info("【websocket消息】有新的连接，总数为:"+webSockets.size());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
    @OnClose
    public void onClose() {
        try {
            webSockets.remove(this);
            log.info("【websocket消息】连接断开，总数为:"+webSockets.size());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @OnMessage
    public void onMessage(String message) {
        log.info("【websocket消息】收到客户端消息:"+message);
    }
    // 此为群组消息
    public void sendGroupMessage(String goodsId, String message) {

    }
    // 此为广播消息
    public void sendAllMessage(String message) {
        log.info("【websocket消息】广播消息:"+message);
        for(PaimaiWebSocket webSocket : webSockets) {
            try {
                if(webSocket.session.isOpen()) {
                    webSocket.session.getAsyncRemote().sendText(message);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    // 此为单点消息
    public void sendOneMessage(String userId, String message) {
        Session session = userSessionPool.get(userId);
        if (session != null&&session.isOpen()) {
            try {
                log.info("【websocket消息】 单点消息:"+message);
                session.getAsyncRemote().sendText(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // 此为单点消息(多人)
    public void sendMoreMessage(String[] userIds, String message) {
        for(String userId:userIds) {
            Session session = userSessionPool.get(userId);
            if (session != null&&session.isOpen()) {
                try {
                    log.info("【websocket消息】 单点消息:"+message);
                    session.getAsyncRemote().sendText(message);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

}
