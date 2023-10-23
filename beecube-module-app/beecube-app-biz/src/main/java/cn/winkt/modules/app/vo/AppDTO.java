package cn.winkt.modules.app.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.jeecg.common.aspect.annotation.Dict;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class AppDTO {

    private java.lang.String id;

    private String authorizerAppid;
    private java.lang.String name;

    private java.lang.String description;

    private java.lang.String moduleId;
    @Dict(dicCode = "app_auth_status")
    private String authStatus;

    private String moduleName;
    private Integer maxRoomUserCount;
    private Integer userCenterLayout;

    private java.lang.String logo;

    @Dict(dicCode = "app_status")
    private java.lang.Integer status;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private java.util.Date endTime;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private java.util.Date createTime;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private java.util.Date authTime;

    private java.lang.String createBy;
}
