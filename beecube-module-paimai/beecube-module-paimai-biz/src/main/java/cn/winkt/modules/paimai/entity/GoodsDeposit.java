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
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods_deposits")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_deposits对象", description="保证金记录表")
public class GoodsDeposit {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**商品ID*/
	@Excel(name = "商品ID", width = 15)
    @ApiModelProperty(value = "商品ID")
	private java.lang.String goodsId;
	/**专场ID*/
	@Excel(name = "专场ID", width = 15)
    @ApiModelProperty(value = "专场ID")
	private java.lang.String performanceId;
	/**拍卖会ID*/
	@Excel(name = "拍卖会ID", width = 15)
    @ApiModelProperty(value = "拍卖会ID")
	private java.lang.String auctionId;
	/**保证金金额*/
	@Excel(name = "保证金金额", width = 15)
    @ApiModelProperty(value = "保证金金额")
	private java.lang.Float price;
	/**缴纳者Id*/
	@Excel(name = "缴纳者Id", width = 15)
    @ApiModelProperty(value = "缴纳者Id")
	private java.lang.String memberId;
	/**缴纳者*/
	@Excel(name = "缴纳者", width = 15)
    @ApiModelProperty(value = "缴纳者")
	private java.lang.String memberName;
	/**缴纳者头像*/
	@Excel(name = "缴纳者头像", width = 15)
    @ApiModelProperty(value = "缴纳者头像")
	private java.lang.String memberAvatar;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**创建人*/
	@Excel(name = "创建人", width = 15)
    @ApiModelProperty(value = "创建人")
	private java.lang.String createBy;
}
