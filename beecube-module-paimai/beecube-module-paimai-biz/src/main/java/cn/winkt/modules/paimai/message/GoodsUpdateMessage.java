package cn.winkt.modules.paimai.message;


import lombok.Data;

import java.util.Date;

@Data
public class GoodsUpdateMessage {
    private String id;
    private Date createTime = new Date();
    private String type;
    private Integer started;
    private Integer ended;
    private Date startTime;
    private Date endTime;
    private Date actualEndTime;
}
