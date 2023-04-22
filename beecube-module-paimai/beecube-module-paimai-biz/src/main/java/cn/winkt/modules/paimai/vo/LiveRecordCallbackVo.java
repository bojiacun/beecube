package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class LiveRecordCallbackVo {
    private Integer appid;
    private String app;
    private String appname;
    private String streamId;
    private String channelId;
    private String fileId;
    private String recordFileId;
    private String fileFormat;
    private String taskId;
    private Long startTime;
    private Long endTime;
    private Integer startTimeUsec;
    private Integer endTimeUsec;
    private Long duration;
    private Long fileSize;
    private String streamParam;
    private String videoUrl;
    private Long mediaStartTime;
    private Long recordBps;
    private String callbackExt;
    private String sign;
    private String t;
}
