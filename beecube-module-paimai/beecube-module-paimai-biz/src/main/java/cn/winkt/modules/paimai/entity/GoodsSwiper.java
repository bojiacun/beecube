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
 * @Description: 商城轮播图
 * @Author: jeecg-boot
 * @Date:   2023-05-28
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods_swipers")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_swipers对象", description="商城轮播图")
public class GoodsSwiper {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**轮播图地址*/
	@Excel(name = "轮播图地址", width = 15)
    @ApiModelProperty(value = "轮播图地址")
	private java.lang.String url;
	/**轮播图图片*/
	@Excel(name = "轮播图图片", width = 15)
    @ApiModelProperty(value = "轮播图图片")
	private java.lang.String image;
	/**排序值*/
	@Excel(name = "排序值", width = 15)
    @ApiModelProperty(value = "排序值")
	private java.lang.Integer sortNum;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
