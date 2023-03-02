package cn.winkt.modules.paimai.message;


import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class OfferMessage {
    private String fromUserId;
    private String fromUserAvatar;
    private String fromUserName;
    private BigDecimal price;
    private Date createTime;
    private String type;
}
