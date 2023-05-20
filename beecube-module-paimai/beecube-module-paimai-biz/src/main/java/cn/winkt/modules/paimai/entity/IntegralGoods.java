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
 * @Description: 积分商品
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_integral_goods")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_integral_goods对象", description="积分商品")
public class IntegralGoods {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**标题*/
	@Excel(name = "标题", width = 15)
    @ApiModelProperty(value = "标题")
	private java.lang.String title;
	/**副标题*/
	@Excel(name = "副标题", width = 15)
    @ApiModelProperty(value = "副标题")
	private java.lang.String subTitle;
	/**标签*/
	@Excel(name = "标签", width = 15)
    @ApiModelProperty(value = "标签")
	private java.lang.String tags;
	/**所需积分*/
	@Excel(name = "所需积分", width = 15)
    @ApiModelProperty(value = "所需积分")
	private java.lang.Float intergral;
	/**型号*/
	@Excel(name = "型号", width = 15)
    @ApiModelProperty(value = "型号")
	private java.lang.String spec;
	/**首页封面*/
	@Excel(name = "首页封面", width = 15)
    @ApiModelProperty(value = "首页封面")
	private java.lang.String homeCover;
	/**列表封面*/
	@Excel(name = "列表封面", width = 15)
    @ApiModelProperty(value = "列表封面")
	private java.lang.String listCover;
	/**商品轮播图*/
	@Excel(name = "商品轮播图", width = 15)
    @ApiModelProperty(value = "商品轮播图")
	private java.lang.String images;
	/**库存余量*/
	@Excel(name = "库存余量", width = 15)
    @ApiModelProperty(value = "库存余量")
	private java.lang.Integer stock;
	/**是否推荐0不推荐1推荐*/
	@Excel(name = "是否推荐0不推荐1推荐", width = 15)
    @ApiModelProperty(value = "是否推荐0不推荐1推荐")
	private java.lang.Integer recommend;
	/**状态0下架1上架*/
	@Excel(name = "状态0下架1上架", width = 15)
    @ApiModelProperty(value = "状态0下架1上架")
	private java.lang.Integer status;
	/**商品简介*/
	@Excel(name = "商品简介", width = 15)
    @ApiModelProperty(value = "商品简介")
	private java.lang.String description;
	/**商品详情*/
	@Excel(name = "商品详情", width = 15)
    @ApiModelProperty(value = "商品详情")
	private java.lang.Object detail;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
