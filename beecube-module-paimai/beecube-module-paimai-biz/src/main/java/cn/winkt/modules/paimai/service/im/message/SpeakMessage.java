package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

@Data
public class SpeakMessage extends RoomMessage{
    private String message;
    private String userId;
    private String userName;
    private String userAvatar;
}
