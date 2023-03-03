package cn.winkt.modules.paimai.config;

import lombok.extern.slf4j.Slf4j;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.exception.JeecgBootException;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
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
@ServerEndpoint("/auction/websocket/{goodsId}/{userId}")
public class GoodsOfferWebSocket {
    private Session session;
    private String goodsId;
    private String userId;

    @Resource
    private RedissonLockClient redissonLockClient;

    private static CopyOnWriteArraySet<GoodsOfferWebSocket> webSockets =new CopyOnWriteArraySet<>();
    private static Map<String,Session> userSessionPool = new HashMap<String,Session>();
    private static ConcurrentHashMap<String, Set<String>> offerGroup = new ConcurrentHashMap<>();


    @OnOpen
    public void onOpen(Session session, @PathParam(value="goodsId") String goodsId, @PathParam(value="userId") String userId) {
        String lockKey = "OFFER-GROUP-"+goodsId;
        try {
            this.session = session;
            this.goodsId = goodsId;
            this.userId = userId;
            webSockets.add(this);
            userSessionPool.put(userId, session);
            if(redissonLockClient == null) {
                throw new JeecgBootException("加锁失败");
            }
            if(redissonLockClient.tryLock(lockKey, -1, 300)) {
                if(!offerGroup.containsKey(goodsId)) {
                    offerGroup.put(goodsId, new HashSet<>());
                }
                offerGroup.get(goodsId).add(userId);
                redissonLockClient.unlock(lockKey);
            }
            else {
                log.info("用户 {} 入群 {} 失败", userId, goodsId);
            }
            log.info("【websocket消息】有新的连接，总数为:"+webSockets.size());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
    @OnClose
    public void onClose() {
        try {
            webSockets.remove(this);
            this.session.close();
            userSessionPool.remove(this.userId);
            if(offerGroup.containsKey(this.goodsId)) {
                offerGroup.get(this.goodsId).remove(this.userId);
            }
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
        Set<String> userIds = offerGroup.get(goodsId);
        sendMoreMessage(userIds.toArray(new String[0]), message);
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
