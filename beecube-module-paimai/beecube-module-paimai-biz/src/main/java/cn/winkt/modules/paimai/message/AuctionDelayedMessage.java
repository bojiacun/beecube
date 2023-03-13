package cn.winkt.modules.paimai.message;


import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class AuctionDelayedMessage extends Message{
    private String type = MessageConstant.MSG_TYPE_DELAY;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date newTime;

    private String goodsId;
}
