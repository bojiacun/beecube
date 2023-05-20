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
 * @Description: 积分订单商品
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_integral_order_goods")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_integral_order_goods对象", description="积分订单商品")
public class IntegralOrderGoods {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**订单ID*/
	@Excel(name = "订单ID", width = 15)
    @ApiModelProperty(value = "订单ID")
	private java.lang.String orderId;
	/**商品ID*/
	@Excel(name = "商品ID", width = 15)
    @ApiModelProperty(value = "商品ID")
	private java.lang.String goodsId;
	/**商品名称*/
	@Excel(name = "商品名称", width = 15)
    @ApiModelProperty(value = "商品名称")
	private java.lang.String goodsName;
	/**商品图片*/
	@Excel(name = "商品图片", width = 15)
    @ApiModelProperty(value = "商品图片")
	private java.lang.String goodsImage;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**商品价格*/
	@Excel(name = "商品价格", width = 15)
    @ApiModelProperty(value = "商品价格")
	private java.lang.Float goodsPrice;
	/**商品数量*/
	@Excel(name = "商品数量", width = 15)
    @ApiModelProperty(value = "商品数量")
	private java.lang.Integer goodsCount;
	/**isAfter*/
	@Excel(name = "isAfter", width = 15)
    @ApiModelProperty(value = "isAfter")
	private java.lang.Integer isAfter;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
