package cn.winkt.modules.app.entity;

import java.io.Serializable;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.jeecg.common.aspect.annotation.Dict;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 应用实体类
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Data
@TableName("beecube_apps")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_apps对象", description="应用实体类")
public class App {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**应用名称*/
	@Excel(name = "应用名称", width = 15)
    @ApiModelProperty(value = "应用名称")
	private java.lang.String name;
	/**应用描述*/
	@Excel(name = "应用描述", width = 15)
    @ApiModelProperty(value = "应用描述")
	private java.lang.String description;
	/**模块ID*/
	@Excel(name = "模块ID", width = 15)
    @ApiModelProperty(value = "模块ID")
	private java.lang.String moduleId;
	private String moduleName;
	/**应用LOGO地址*/
	@Excel(name = "应用LOGO地址", width = 15)
    @ApiModelProperty(value = "应用LOGO地址")
	private java.lang.String logo;
	/**应用状态,0是禁用，1是正常*/
	@Excel(name = "应用状态,0是禁用，1是正常", width = 15)
    @ApiModelProperty(value = "应用状态,0是禁用，1是正常")
	@Dict(dicCode = "app_status")
	private java.lang.Integer status;
	/**应用过期时间*/
	@Excel(name = "应用过期时间", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "应用过期时间")
	private java.util.Date endTime;
	/**创建时间*/
	@Excel(name = "创建时间", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**创建人ID*/
	@Excel(name = "创建人ID", width = 15)
    @ApiModelProperty(value = "创建人ID")
	private java.lang.String createBy;
}
