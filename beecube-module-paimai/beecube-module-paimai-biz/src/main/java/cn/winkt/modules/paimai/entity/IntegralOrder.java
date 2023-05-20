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
 * @Description: 积分商品分类
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_integral_orders")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_integral_orders对象", description="积分商品订单")
public class IntegralOrder {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**拍品ID*/
	@Excel(name = "拍品ID", width = 15)
    @ApiModelProperty(value = "拍品ID")
	private java.lang.String goodsId;
	/**商品数量*/
	@Excel(name = "商品数量", width = 15)
    @ApiModelProperty(value = "商品数量")
	private java.lang.Integer goodsCount;
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
	/**deliveryNo*/
	@Excel(name = "deliveryNo", width = 15)
    @ApiModelProperty(value = "deliveryNo")
	private java.lang.String deliveryNo;
	/**deliveryCode*/
	@Excel(name = "deliveryCode", width = 15)
    @ApiModelProperty(value = "deliveryCode")
	private java.lang.String deliveryCode;
	/**deliveryProvince*/
	@Excel(name = "deliveryProvince", width = 15)
    @ApiModelProperty(value = "deliveryProvince")
	private java.lang.String deliveryProvince;
	/**deliveryCity*/
	@Excel(name = "deliveryCity", width = 15)
    @ApiModelProperty(value = "deliveryCity")
	private java.lang.String deliveryCity;
	/**deliveryDistrict*/
	@Excel(name = "deliveryDistrict", width = 15)
    @ApiModelProperty(value = "deliveryDistrict")
	private java.lang.String deliveryDistrict;
	/**deliveryUsername*/
	@Excel(name = "deliveryUsername", width = 15)
    @ApiModelProperty(value = "deliveryUsername")
	private java.lang.String deliveryUsername;
	/**deliveryPhone*/
	@Excel(name = "deliveryPhone", width = 15)
    @ApiModelProperty(value = "deliveryPhone")
	private java.lang.String deliveryPhone;
	/**deliveryAddress*/
	@Excel(name = "deliveryAddress", width = 15)
    @ApiModelProperty(value = "deliveryAddress")
	private java.lang.String deliveryAddress;
	/**deliveryId*/
	@Excel(name = "deliveryId", width = 15)
    @ApiModelProperty(value = "deliveryId")
	private java.lang.String deliveryId;
	/**订单创建时间*/
    @ApiModelProperty(value = "订单创建时间")
	private java.util.Date createTime;
	/**更新时间*/
    @ApiModelProperty(value = "更新时间")
	private java.util.Date updateTime;
	/**支付时间*/
    @ApiModelProperty(value = "支付时间")
	private java.util.Date payTime;
	/**transactionId*/
	@Excel(name = "transactionId", width = 15)
    @ApiModelProperty(value = "transactionId")
	private java.lang.String transactionId;
	/**订单状态（0未支付、1待发货、2待收货、3已完成、4申请售后）*/
	@Excel(name = "订单状态（0未支付、1待发货、2待收货、3已完成、4申请售后）", width = 15)
    @ApiModelProperty(value = "订单状态（0未支付、1待发货、2待收货、3已完成、4申请售后）")
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
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
