package cn.winkt.modules.app.entity;

import java.io.Serializable;
import java.math.BigDecimal;
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
 * @Description: 用户提现申请表
 * @Author: jeecg-boot
 * @Date:   2023-03-14
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_member_withdraws")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_member_withdraws对象", description="用户提现申请表")
public class AppMemberWithdraw {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**提现人ID*/
	@Excel(name = "提现人ID", width = 15)
    @ApiModelProperty(value = "提现人ID")
	private java.lang.String memberId;
	/**提现人名称*/
	@Excel(name = "提现人名称", width = 15)
    @ApiModelProperty(value = "提现人名称")
	private java.lang.String memberName;
	/**提现人联系电话*/
	@Excel(name = "提现人联系电话", width = 15)
    @ApiModelProperty(value = "提现人联系电话")
	private java.lang.String memberPhone;
	/**提现状态0为已申请、1为已打款、2为已拒绝*/
	@Excel(name = "提现状态0为已申请、1为已打款、2为已拒绝", width = 15)
    @ApiModelProperty(value = "提现状态0为已申请、1为已打款、2为已拒绝")
	private java.lang.Integer status;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
	/**createBy*/
	@Excel(name = "createBy", width = 15)
    @ApiModelProperty(value = "createBy")
	private java.lang.String createBy;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**处理时间*/
    @ApiModelProperty(value = "处理时间")
	private java.util.Date resolveTime;
	/**处理人*/
	@Excel(name = "处理人", width = 15)
    @ApiModelProperty(value = "处理人")
	private java.lang.String resolver;
	/**交易单号*/
	@Excel(name = "交易单号", width = 15)
    @ApiModelProperty(value = "交易单号")
	private java.lang.String transactionId;
	private BigDecimal amount;
	private Integer type;
}
