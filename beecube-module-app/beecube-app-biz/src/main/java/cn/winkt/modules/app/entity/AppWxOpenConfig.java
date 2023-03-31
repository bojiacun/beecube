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
 * @Description: 微信开放平台配置表
 * @Author: jeecg-boot
 * @Date:   2023-04-01
 * @Version: V1.0
 */
@Data
@TableName("beecube_wxopen_configs")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_wxopen_configs对象", description="微信开放平台配置表")
public class AppWxOpenConfig {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**配置Key*/
	@Excel(name = "配置Key", width = 15)
    @ApiModelProperty(value = "配置Key")
	private java.lang.String settingKey;
	/**配置值*/
	@Excel(name = "配置值", width = 15)
    @ApiModelProperty(value = "配置值")
	private java.lang.String settingValue;
	/**配合标题*/
	@Excel(name = "配合标题", width = 15)
    @ApiModelProperty(value = "配合标题")
	private java.lang.String title;
}
