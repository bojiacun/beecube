package cn.winkt.modules.paimai.message;


import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class PerformanceUpdateMessage {
    private String id;
    private Date createTime = new Date();
    private String type;
    private Integer started;
    private Integer ended;
    private Date startTime;
}
