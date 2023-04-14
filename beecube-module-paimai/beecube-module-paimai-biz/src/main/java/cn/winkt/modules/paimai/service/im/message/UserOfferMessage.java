package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserOfferMessage extends BaseMessage{
    private String goodsId;
    private BigDecimal price;
    private String userId;
    private String userName;
    private String userAvatar;
}
