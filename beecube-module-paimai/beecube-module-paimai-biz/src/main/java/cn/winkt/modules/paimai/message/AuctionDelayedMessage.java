package cn.winkt.modules.paimai.message;


import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class AuctionDelayedMessage {
    private String id;
    private Date createTime;
    private String type = MessageConstant.MSG_TYPE_DELAY;
    private Date newTime;
}
