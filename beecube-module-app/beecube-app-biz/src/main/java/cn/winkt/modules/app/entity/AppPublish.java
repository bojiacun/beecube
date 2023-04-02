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
 * @Description: 应用前端发布版本表
 * @Author: jeecg-boot
 * @Date:   2023-04-02
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_publishes")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_publishes对象", description="应用前端发布版本表")
public class AppPublish {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**发布的代码版本号*/
	@Excel(name = "发布的代码版本号", width = 15)
    @ApiModelProperty(value = "发布的代码版本号")
	private java.lang.String version;
	/**该版本的体验二维码*/
	@Excel(name = "该版本的体验二维码", width = 15)
    @ApiModelProperty(value = "该版本的体验二维码")
	private String previewQrcode;
	/**正式版小程序码*/
	@Excel(name = "正式版小程序码", width = 15)
    @ApiModelProperty(value = "正式版小程序码")
	private String qrcode;
	/**该发布的状态，0为未发布，1为审核中，2为已发布*/
	@Excel(name = "该发布的状态，0为未发布，1为审核中，2为已发布", width = 15)
    @ApiModelProperty(value = "该发布的状态，0为未发布，1为审核中，2为已发布")
	private java.lang.Integer status;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**发布时间*/
    @ApiModelProperty(value = "发布时间")
	private java.util.Date pubTime;
}
