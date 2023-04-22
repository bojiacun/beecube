package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

@Data
public class MuteMessage extends BaseMessage{
    private String message = "您已被禁言";
}
