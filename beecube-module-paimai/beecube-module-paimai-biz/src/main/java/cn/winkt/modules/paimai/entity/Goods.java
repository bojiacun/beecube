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
 * @Description: 拍品表
 * @Author: jeecg-boot
 * @Date:   2023-02-10
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods对象", description="拍品表")
public class Goods {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**分类ID*/
	@Excel(name = "分类ID", width = 15)
    @ApiModelProperty(value = "分类ID")
	private java.lang.String classId;
	/**主标题*/
	@Excel(name = "主标题", width = 15)
    @ApiModelProperty(value = "主标题")
	private java.lang.String title;
	/**副标题*/
	@Excel(name = "副标题", width = 15)
    @ApiModelProperty(value = "副标题")
	private java.lang.String subTitle;
	/**拍品类型（1普通拍品、2一口价）*/
	@Excel(name = "拍品类型（1普通拍品、2一口价）", width = 15)
    @ApiModelProperty(value = "拍品类型（1普通拍品、2一口价）")
	@Dict(dicCode = "paimai_goods_type")
	private java.lang.Integer type;
	/**单品保证金*/
	@Excel(name = "单品保证金", width = 15)
    @ApiModelProperty(value = "单品保证金")
	private java.lang.Float deposit;
	/**起拍价*/
	@Excel(name = "起拍价", width = 15)
    @ApiModelProperty(value = "起拍价")
	private java.lang.Float startPrice;
	/**加价幅度配置*/
	@Excel(name = "加价幅度配置", width = 15)
    @ApiModelProperty(value = "加价幅度配置")
	private java.lang.Object uprange;
	/**延时周期（分钟）*/
	@Excel(name = "延时周期（分钟）", width = 15)
    @ApiModelProperty(value = "延时周期（分钟）")
	private java.lang.Integer delayTime;
	/**拍卖佣金配置*/
	@Excel(name = "拍卖佣金配置", width = 15)
    @ApiModelProperty(value = "拍卖佣金配置")
	private java.lang.Object commission;
	/**专场ID*/
	@Excel(name = "专场ID", width = 15)
    @ApiModelProperty(value = "专场ID")
	private java.lang.Integer performanceId;
	/**预计结束时间*/
    @ApiModelProperty(value = "预计结束时间")
	private java.util.Date endTime;
	/**其他字段描述*/
	@Excel(name = "其他字段描述", width = 15)
    @ApiModelProperty(value = "其他字段描述")
	private java.lang.Object fields;
	/**拍品描述*/
	@Excel(name = "拍品描述", width = 15)
    @ApiModelProperty(value = "拍品描述")
	private java.lang.String description;
	/**拍品流程*/
	@Excel(name = "拍品流程", width = 15)
    @ApiModelProperty(value = "拍品流程")
	private java.lang.String descFlow;
	/**物流运输*/
	@Excel(name = "物流运输", width = 15)
    @ApiModelProperty(value = "物流运输")
	private java.lang.String descDelivery;
	/**注意事项*/
	@Excel(name = "注意事项", width = 15)
    @ApiModelProperty(value = "注意事项")
	private java.lang.String descNotice;
	/**拍卖须知*/
	@Excel(name = "拍卖须知", width = 15)
    @ApiModelProperty(value = "拍卖须知")
	private java.lang.String descRead;
	/**保证金说明*/
	@Excel(name = "保证金说明", width = 15)
    @ApiModelProperty(value = "保证金说明")
	private java.lang.String descDeposit;
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
	/**更新时间*/
	@Excel(name = "更新时间", width = 15)
    @ApiModelProperty(value = "更新时间")
	private java.lang.String updateBy;
	/**应用ID*/
	@Excel(name = "应用ID", width = 15)
    @ApiModelProperty(value = "应用ID")
	private java.lang.String appId;
	/**实际结束时间*/
    @ApiModelProperty(value = "实际结束时间")
	private java.util.Date actualEndTime;
	/**图片*/
	@Excel(name = "图片", width = 15)
    @ApiModelProperty(value = "图片")
	private java.lang.String images;
	/**状态（0下架1上架）*/
	@Excel(name = "状态（0下架1上架）", width = 15)
    @ApiModelProperty(value = "状态（0下架1上架）")
	@Dict(dicCode = "paimai_goods_status")
	private java.lang.Integer status;
}
