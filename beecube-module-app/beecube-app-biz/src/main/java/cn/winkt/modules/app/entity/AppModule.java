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
 * @Description: 应用模块
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Data
@TableName("beecube_modules")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_modules对象", description="应用模块")
public class AppModule {
    
	/**模块ID*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "模块ID")
	private java.lang.String id;
	/**模块标识*/
	@Excel(name = "模块标识", width = 15)
    @ApiModelProperty(value = "模块标识")
	private java.lang.String identify;

	private String description;
	/**模块名称*/
	@Excel(name = "模块名称", width = 15)
    @ApiModelProperty(value = "模块名称")
	private java.lang.String name;
	/**模块LOGO*/
	@Excel(name = "模块LOGO", width = 15)
    @ApiModelProperty(value = "模块LOGO")
	private java.lang.String logo;
	/**0为未安装1已安装2已卸载*/
	@Excel(name = "0为未安装1已安装2已卸载", width = 15)
    @ApiModelProperty(value = "0为未安装1已安装2已卸载")
	private java.lang.Integer status;
	/**模块作者*/
	@Excel(name = "模块作者", width = 15)
    @ApiModelProperty(value = "模块作者")
	private java.lang.String author;
	/**版本号*/
	@Excel(name = "版本号", width = 15)
    @ApiModelProperty(value = "版本号")
	private java.lang.String version;
	@Excel(name = "新版本号", width = 15)
	@ApiModelProperty(value = "新版本号")
	private String newVersion;
	/**是否支持h5*/
	@Excel(name = "是否支持h5", width = 15)
    @ApiModelProperty(value = "是否支持h5")
	private java.lang.Integer supportH5;
	/**是否支持微信小程序*/
	@Excel(name = "是否支持微信小程序", width = 15)
    @ApiModelProperty(value = "是否支持微信小程序")
	private java.lang.Integer supportWechat;
	/**是否支持抖音小程序*/
	@Excel(name = "是否支持抖音小程序", width = 15)
    @ApiModelProperty(value = "是否支持抖音小程序")
	private java.lang.Integer supportDouyin;
	/**安装信息*/
	@Excel(name = "安装信息", width = 15)
    @ApiModelProperty(value = "安装信息")
	private java.lang.String manifest;
	/**模块注册时间*/
	@Excel(name = "模块注册时间", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "模块注册时间")
	private java.util.Date createTime;
}
