package cn.winkt.modules.app.vo;

import lombok.Data;
import org.jeecg.common.aspect.annotation.Dict;

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

    private java.util.Date endTime;

    private java.util.Date createTime;

    private java.lang.String createBy;
}
