package cn.winkt.modules.app.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.jeecg.common.aspect.annotation.Dict;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class AppDTO {

    private java.lang.String id;

    private java.lang.String name;

    private java.lang.String description;

    private java.lang.String moduleId;

    private String moduleName;

    private java.lang.String logo;

    @Dict(dicCode = "app_status")
    private java.lang.Integer status;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private java.util.Date endTime;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private java.util.Date createTime;

    private java.lang.String createBy;
}
