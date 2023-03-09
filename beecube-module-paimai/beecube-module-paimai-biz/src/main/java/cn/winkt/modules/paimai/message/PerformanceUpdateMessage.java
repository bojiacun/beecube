package cn.winkt.modules.paimai.message;


import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class PerformanceUpdateMessage {
    private String id;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date createTime = new Date();
    private String type;
    private Integer started;
    private Integer ended;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
}
