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
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("paimai_performances")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_performances对象", description="拍卖专场表")
public class Performance {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**标题*/
	@Excel(name = "标题", width = 15)
    @ApiModelProperty(value = "标题")
	private java.lang.String title;
	/**开拍时间*/
    @ApiModelProperty(value = "开拍时间")
	private java.util.Date startTime;
	/**结束时间*/
    @ApiModelProperty(value = "结束时间")
	private java.util.Date endTime;
	/**固定保证金*/
	@Excel(name = "固定保证金", width = 15)
    @ApiModelProperty(value = "固定保证金")
	private java.lang.Float deposit;
	/**预览图片*/
	@Excel(name = "预览图片", width = 15)
    @ApiModelProperty(value = "预览图片")
	private java.lang.String preview;
	/**拍卖会ID*/
	@Excel(name = "拍卖会ID", width = 15)
    @ApiModelProperty(value = "拍卖会ID")
	private java.lang.String auctionId;
	/**专场类型（1限时拍、2为同步拍)*/
	@Excel(name = "专场类型（1限时拍、2为同步拍)", width = 15)
    @ApiModelProperty(value = "专场类型（1限时拍、2为同步拍)")
	@Dict(dicCode = "paimai_performance_type")
	private java.lang.Integer type;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**创建人*/
	@Excel(name = "创建人", width = 15)
    @ApiModelProperty(value = "创建人")
	private java.lang.String createBy;
	/**更新时间*/
    @ApiModelProperty(value = "更新时间")
	private java.util.Date updateTime;
	/**更新人*/
	@Excel(name = "更新人", width = 15)
    @ApiModelProperty(value = "更新人")
	private java.lang.String updateBy;
	/**状态（0下架、1上架）*/
	@Excel(name = "状态（0下架、1上架）", width = 15)
    @ApiModelProperty(value = "状态（0下架、1上架）")
	@Dict(dicCode = "paimai_performance_status")
	private java.lang.Integer status;

	@Excel(name = "应用ID", width = 15)
	@ApiModelProperty(value = "应用ID")
	private java.lang.String appId;
}
