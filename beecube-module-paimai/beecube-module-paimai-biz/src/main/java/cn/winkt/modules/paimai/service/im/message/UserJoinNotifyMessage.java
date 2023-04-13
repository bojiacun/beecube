package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

@Data
public class UserJoinNotifyMessage {
    private String userId;
    private String userName;
    private String userAvatar;
}
