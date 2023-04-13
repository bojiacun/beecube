package cn.winkt.modules.paimai.service.im;

public interface ServerMessageType {
    //服务器给客户端发送房间公告
    int LIVE_ROOM_NOTICE = 1;
    //用户加入房间通知
    int USER_JOIN_NOTIFY = 2;
}
