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
import org.jeecg.common.aspect.annotation.Dict;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 优惠券票据
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_coupon_tickets")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_coupon_tickets对象", description="优惠券票据")
public class CouponTicket {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**couponId*/
	@Excel(name = "couponId", width = 15)
    @ApiModelProperty(value = "couponId")
	private java.lang.String couponId;
	private String couponTitle;
	@TableField(exist = false)
	private Coupon coupon;
	/**memberId*/
	@Excel(name = "memberId", width = 15)
    @ApiModelProperty(value = "memberId")
	private java.lang.String memberId;
	private String memberAvatar;
	private String memberName;
	/**适用状态0未使用1已使用*/
	@Excel(name = "适用状态0未使用1已使用", width = 15)
    @ApiModelProperty(value = "适用状态0未使用1已使用")
	@Dict(dicCode = "paimai_coupon_ticket_staus")
	private java.lang.Integer status;
	/**适用时间*/
    @ApiModelProperty(value = "适用时间")
	private java.util.Date usedTime;
	/**适用的订单号*/
	@Excel(name = "适用的订单号", width = 15)
    @ApiModelProperty(value = "适用的订单号")
	private java.lang.String useOrderId;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	private java.util.Date endTime;
	private java.util.Date startTime;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
