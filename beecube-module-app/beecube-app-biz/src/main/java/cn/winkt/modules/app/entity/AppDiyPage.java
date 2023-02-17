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
 * @Description: 应用页面设计表
 * @Author: jeecg-boot
 * @Date:   2023-02-15
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_diy_pages")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_diy_pages对象", description="应用页面设计表")
public class AppDiyPage implements Serializable {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
	/**控件配置*/
	@Excel(name = "控件配置", width = 15)
    @ApiModelProperty(value = "控件配置")
	private java.lang.String controls;
	/**页面模块配置*/
	@Excel(name = "页面模块配置", width = 15)
    @ApiModelProperty(value = "页面模块配置")
	private java.lang.String modules;
	/**页面标题*/
	@Excel(name = "页面标题", width = 15)
    @ApiModelProperty(value = "页面标题")
	private java.lang.String title;
	/**页面样式*/
	@Excel(name = "页面样式", width = 15)
    @ApiModelProperty(value = "页面样式")
	private java.lang.String styles;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**页面标识*/
	@Excel(name = "页面标识", width = 15)
    @ApiModelProperty(value = "页面标识")
	private java.lang.String identifier;
}
