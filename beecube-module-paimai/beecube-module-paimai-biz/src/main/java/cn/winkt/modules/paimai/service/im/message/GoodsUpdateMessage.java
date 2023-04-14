package cn.winkt.modules.paimai.service.im.message;


import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.Date;

@Data
public class GoodsUpdateMessage extends RoomMessage{
    private String goodsId;
    private String type;
    private Integer state;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date actualEndTime;
    private Float dealPrice;
    private String dealUserId;
}
