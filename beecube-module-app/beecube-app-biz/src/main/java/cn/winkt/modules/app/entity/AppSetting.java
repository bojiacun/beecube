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
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 应用配置表
 * @Author: jeecg-boot
 * @Date:   2022-12-19
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_settings")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_settings对象", description="应用配置表")
public class AppSetting {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**配置标题*/
	@Excel(name = "配置标题", width = 15)
    @ApiModelProperty(value = "配置标题")
	private java.lang.String title;
	/**配置说明*/
	@Excel(name = "配置说明", width = 15)
    @ApiModelProperty(value = "配置说明")
	private java.lang.String description;
	/**配置Key*/
	@Excel(name = "配置Key", width = 15)
    @ApiModelProperty(value = "配置Key")
	private java.lang.String settingKey;
	/**配置值*/
	@Excel(name = "配置值", width = 15)
    @ApiModelProperty(value = "配置值")
	private java.lang.String settingValue;
	/**所属APPID*/
	@Excel(name = "所属APPID", width = 15)
    @ApiModelProperty(value = "所属APPID")
	private java.lang.String appId;
	/**配置分组*/
	@Excel(name = "配置分组", width = 15)
    @ApiModelProperty(value = "配置分组")
	private java.lang.String groupKey;
}
