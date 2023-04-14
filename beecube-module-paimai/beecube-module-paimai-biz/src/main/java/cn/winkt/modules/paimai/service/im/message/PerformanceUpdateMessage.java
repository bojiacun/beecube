package cn.winkt.modules.paimai.service.im.message;


import cn.hutool.core.lang.Snowflake;
import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class PerformanceUpdateMessage extends RoomMessage{
    private String performanceId;
    private String type;
    private Integer state;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;
}
