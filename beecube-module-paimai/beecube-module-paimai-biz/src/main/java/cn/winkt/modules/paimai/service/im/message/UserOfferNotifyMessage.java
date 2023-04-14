package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserOfferNotifyMessage {
    private String userId;
    private String userName;
    private String userAvatar;
    private String goodsId;
    private BigDecimal price;
}
