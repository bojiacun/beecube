package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class LiveRecordCallbackVo {
    private Integer appid;
    private String app;
    private String appname;
    private String stream_id;
    private String channel_id;
    private String file_id;
    private String record_file_id;
    private String file_format;
    private String task_id;
    private Long start_time;
    private Long end_time;
    private Integer start_time_usec;
    private Integer end_time_usec;
    private Long duration;
    private Long file_size;
    private String stream_param;
    private String video_url;
    private Long media_start_time;
    private Long record_bps;
    private String callback_ext;
    private String sign;
    private String t;
}
