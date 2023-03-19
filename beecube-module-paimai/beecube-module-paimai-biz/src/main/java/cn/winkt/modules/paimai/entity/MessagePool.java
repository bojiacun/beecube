package cn.winkt.modules.paimai.entity;

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
 * @Description: 拍卖消息队列表
 * @Author: jeecg-boot
 * @Date:   2023-03-08
 * @Version: V1.0
 */
@Data
@TableName("paimai_messages_pool")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_messages_pool对象", description="拍卖消息队列表")
public class MessagePool {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**消息接收者用户ID*/
	@Excel(name = "消息接收者用户ID", width = 15)
    @ApiModelProperty(value = "消息接收者用户ID")
	private java.lang.String memberId;
	/**消息体内容*/
	@Excel(name = "消息体内容", width = 15)
    @ApiModelProperty(value = "消息体内容")
	private java.lang.String message;
	/**预计发送时间*/
    @ApiModelProperty(value = "预计发送时间")
	private java.util.Date sendTime;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**关联商品ID*/
	@Excel(name = "关联商品ID", width = 15)
    @ApiModelProperty(value = "关联商品ID")
	private java.lang.String goodsId;
	/**关联专场ID*/
	@Excel(name = "关联专场ID", width = 15)
    @ApiModelProperty(value = "关联专场ID")
	private java.lang.String performanceId;
	/**消息类型0为未知、1为开始提醒、2为结束提醒*/
	@Excel(name = "消息类型0为未知、1为开始提醒、2为结束提醒", width = 15)
    @ApiModelProperty(value = "消息类型0为未知、1为开始提醒、2为结束提醒")
	private java.lang.Integer type;
	/**消息是否已经发送，0为未发送、1为已发送*/
	@Excel(name = "消息是否已经发送，0为未发送、1为已发送", width = 15)
    @ApiModelProperty(value = "消息是否已经发送，0为未发送、1为已发送")
	private java.lang.Integer status;

	private String memberOpenId;
	private String templateId;
	private String formId;

	private String appId;
}
