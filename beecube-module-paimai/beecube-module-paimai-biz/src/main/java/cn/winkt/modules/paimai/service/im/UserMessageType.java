package cn.winkt.modules.paimai.service.im;

public interface UserMessageType {
    int JOIN_ROOM = 1;
    int LEAVE_ROOM = 2;

    int SPEAK = 3;

    int OFFER = 4;

    int AUCTION_DELAYED = 5;
    int DEAL = 6;
    int GOODS_UPDATE = 7;
    int PERFORMANCE_UPDATE = 8;

    int KICKOUT_ROOM = 97;
    int ROOM_STREAM_CHANGED = 98;
    int ROOM_NOTICE = 99;
    int SHUTUP = 100;
}
