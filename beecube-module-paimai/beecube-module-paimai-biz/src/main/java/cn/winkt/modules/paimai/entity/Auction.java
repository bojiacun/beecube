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
@TableName("paimai_auctions")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_auctions对象", description="订单售后表")
public class Auction {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**拍卖会名称*/
	@Excel(name = "拍卖会名称", width = 15)
    @ApiModelProperty(value = "拍卖会名称")
	private java.lang.String title;
	/**拍卖时间*/
	@Excel(name = "拍卖时间", width = 15)
    @ApiModelProperty(value = "拍卖时间")
	private java.lang.String timeRange;
	/**拍卖地点*/
	@Excel(name = "拍卖地点", width = 15)
    @ApiModelProperty(value = "拍卖地点")
	private java.lang.String address;
	/**拍卖会预览图*/
	@Excel(name = "拍卖会预览图", width = 15)
    @ApiModelProperty(value = "拍卖会预览图")
	private java.lang.String preview;
	/**状态（0下架1上架)*/
	@Excel(name = "状态（0下架1上架)", width = 15)
    @ApiModelProperty(value = "状态（0下架1上架)")
	private java.lang.Integer status;
}
