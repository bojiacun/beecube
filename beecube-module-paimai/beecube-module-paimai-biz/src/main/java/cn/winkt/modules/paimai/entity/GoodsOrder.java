package cn.winkt.modules.paimai.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

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
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("paimai_orders")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_orders对象", description="订单表")
public class GoodsOrder {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**拍品ID*/
	@Excel(name = "拍品ID", width = 15)
    @ApiModelProperty(value = "拍品ID")
	private java.lang.String goodsId;
	@Excel(name = "拍品数量", width = 15)
	@ApiModelProperty(value = "拍品数量")
	private java.lang.Integer goodsCount;
	@Excel(name = "出价记录ID", width = 15)
	@ApiModelProperty(value = "出价记录ID")
	private java.lang.String goodsOfferId;
	@ApiModelProperty(value = "专场ID")
	private java.lang.String performanceId;
	@Excel(name = "拍卖会ID", width = 15)
	@ApiModelProperty(value = "拍卖会ID")
	private java.lang.String auctionId;

	@Excel(name = "订单类型（1拍卖订单、2一口价订单）", width = 15)
	@ApiModelProperty(value = "订单类型（1拍卖订单、2一口价订单")
	@Dict(dicCode = "paimai_order_type")
	private Integer type;

	private String transactionId;
	/**会员ID*/
	@Excel(name = "会员ID", width = 15)
    @ApiModelProperty(value = "会员ID")
	private java.lang.String memberId;
	/**会员名称*/
	@Excel(name = "会员名称", width = 15)
    @ApiModelProperty(value = "会员名称")
	private java.lang.String memberName;
	/**会员头像*/
	@Excel(name = "会员头像", width = 15)
    @ApiModelProperty(value = "会员头像")
	private java.lang.String memberAvatar;
	/**发货信息*/
	@Excel(name = "发货信息", width = 15)
    @ApiModelProperty(value = "发货信息")
	private java.lang.String deliveryInfo;
	private java.lang.String deliveryUsername;
	private java.lang.String deliveryPhone;
	private java.lang.String deliveryProvince;
	private java.lang.String deliveryCity;
	private java.lang.String deliveryDistrict;
	private java.lang.String deliveryAddress;
	private java.lang.String deliveryId;
	private String deliveryNo;
	private String deliveryCode;
	/**订单创建时间*/
    @ApiModelProperty(value = "订单创建时间")
	private java.util.Date createTime;
	/**更新时间*/
    @ApiModelProperty(value = "更新时间")
	private java.util.Date updateTime;
	/**支付时间*/
    @ApiModelProperty(value = "支付时间")
	private java.util.Date payTime;
	/**订单状态（0未支付、1待发货、2待收货、3已完成、4申请售后）*/
	@Excel(name = "订单状态（0未支付、1待发货、2待收货、3已完成、4申请售后）", width = 15)
    @ApiModelProperty(value = "订单状态（0未支付、1待发货、2待收货、3已完成、4申请售后）")
	@Dict(dicCode = "paimai_order_status")
	private java.lang.Integer status;
	/**订单实际支付金额*/
	@Excel(name = "订单实际支付金额", width = 15)
    @ApiModelProperty(value = "订单实际支付金额")
	private java.lang.Float payedPrice;
	/**订单商品总价*/
	@Excel(name = "订单商品总价", width = 15)
    @ApiModelProperty(value = "订单商品总价")
	private java.lang.Float totalPrice;
	/**创建人*/
	@Excel(name = "创建人", width = 15)
    @ApiModelProperty(value = "创建人")
	private java.lang.String createBy;
	/**更新人*/
	@Excel(name = "更新人", width = 15)
    @ApiModelProperty(value = "更新人")
	private java.lang.String updateBy;
	@Excel(name = "应用ID", width = 15)
	@ApiModelProperty(value = "应用ID")
	private java.lang.String appId;


	private String couponId;
	private String couponTitle;
	private String usedIntegral;

	@TableField(exist = false)
	private List<OrderGoods> orderGoods;

	@TableField(exist = false)
	private List<GoodsOrderSettlement> settlements;
}
