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
 * @Description: 积分商品订单售后
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_integral_order_afters")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_integral_order_afters对象", description="积分商品订单售后")
public class IntegralOrderAfter {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**售后类型（1退货、2换货）*/
	@Excel(name = "售后类型（1退货、2换货）", width = 15)
    @ApiModelProperty(value = "售后类型（1退货、2换货）")
	private java.lang.Integer type;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**创建人*/
	@Excel(name = "创建人", width = 15)
    @ApiModelProperty(value = "创建人")
	private java.lang.String createBy;
	/**售后描述信息*/
	@Excel(name = "售后描述信息", width = 15)
    @ApiModelProperty(value = "售后描述信息")
	private java.lang.String description;
	/**订单ID*/
	@Excel(name = "订单ID", width = 15)
    @ApiModelProperty(value = "订单ID")
	private java.lang.String orderId;
	/**更新时间*/
    @ApiModelProperty(value = "更新时间")
	private java.util.Date updateTime;
	/**处理人*/
	@Excel(name = "处理人", width = 15)
    @ApiModelProperty(value = "处理人")
	private java.lang.String updateBy;
	/**状态（0待处理、1已处理、2拒绝）*/
	@Excel(name = "状态（0待处理、1已处理、2拒绝）", width = 15)
    @ApiModelProperty(value = "状态（0待处理、1已处理、2拒绝）")
	@Dict(dicCode = "paimai_integral_after_status")
	private java.lang.Integer status;
	/**订单商品ID*/
	@Excel(name = "订单商品ID", width = 15)
    @ApiModelProperty(value = "订单商品ID")
	private java.lang.String orderGoodsId;
	/**memberId*/
	@Excel(name = "memberId", width = 15)
    @ApiModelProperty(value = "memberId")
	private java.lang.String memberId;
	/**memberName*/
	@Excel(name = "memberName", width = 15)
    @ApiModelProperty(value = "memberName")
	private java.lang.String memberName;
	/**memberAvatar*/
	@Excel(name = "memberAvatar", width = 15)
    @ApiModelProperty(value = "memberAvatar")
	private java.lang.String memberAvatar;
	/**resolver*/
	@Excel(name = "resolver", width = 15)
    @ApiModelProperty(value = "resolver")
	private java.lang.String resolver;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
