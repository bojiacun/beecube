package cn.winkt.modules.paimai.message;


import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class OfferMessage extends Message{
    private String fromUserId;
    private String fromUserAvatar;
    private String fromUserName;
    private BigDecimal price;
    private String type = MessageConstant.MSG_TYPE_OFFER;
}
