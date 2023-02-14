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
 * @Description: 应用导航表
 * @Author: jeecg-boot
 * @Date:   2023-02-14
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_navs")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_navs对象", description="应用导航表")
public class AppNav {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**导航标题*/
	@Excel(name = "导航标题", width = 15)
    @ApiModelProperty(value = "导航标题")
	private java.lang.String title;
	/**导航图标地址*/
	@Excel(name = "导航图标地址", width = 15)
    @ApiModelProperty(value = "导航图标地址")
	private java.lang.String icon;
	/**激活导航图标地址*/
	@Excel(name = "激活导航图标地址", width = 15)
    @ApiModelProperty(value = "激活导航图标地址")
	private java.lang.String iconActive;
	/**文本颜色*/
	@Excel(name = "文本颜色", width = 15)
    @ApiModelProperty(value = "文本颜色")
	private java.lang.String textColor;
	/**激活文本颜色*/
	@Excel(name = "激活文本颜色", width = 15)
    @ApiModelProperty(value = "激活文本颜色")
	private java.lang.String textColorActive;
	/**排序*/
	@Excel(name = "排序", width = 15)
    @ApiModelProperty(value = "排序")
	private java.lang.Integer ordernum;
	/**是否显示（0不显示、1显示）*/
	@Excel(name = "是否显示（0不显示、1显示）", width = 15)
    @ApiModelProperty(value = "是否显示（0不显示、1显示）")
	private java.lang.Integer status;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
