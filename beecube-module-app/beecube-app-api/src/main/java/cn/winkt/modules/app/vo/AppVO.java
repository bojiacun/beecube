package cn.winkt.modules.app.vo;


import lombok.Data;

import java.util.Date;

@Data
public class AppVO {
    private java.lang.String id;
    private java.lang.String name;
    private Integer maxRoomUserCount;
    private Integer status;
    private Date endTime;
}
