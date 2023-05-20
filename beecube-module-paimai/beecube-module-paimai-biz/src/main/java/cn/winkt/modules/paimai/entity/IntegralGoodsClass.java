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
 * @Description: 积分商品分类
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_integral_goods_classes")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_integral_goods_classes对象", description="积分商品分类")
public class IntegralGoodsClass {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**分类名称*/
	@Excel(name = "分类名称", width = 15)
    @ApiModelProperty(value = "分类名称")
	private java.lang.String name;
	/**父分类ID*/
	@Excel(name = "父分类ID", width = 15)
    @ApiModelProperty(value = "父分类ID")
	private java.lang.String parentId;
	/**APPID*/
	@Excel(name = "APPID", width = 15)
    @ApiModelProperty(value = "APPID")
	private java.lang.String appId;
	/**状态（0不显示、1显示）*/
	@Excel(name = "状态（0不显示、1显示）", width = 15)
    @ApiModelProperty(value = "状态（0不显示、1显示）")
	@Dict(dicCode = "paimai_show_status")
	private java.lang.Integer status;
	/**sortNum*/
	@Excel(name = "sortNum", width = 15)
    @ApiModelProperty(value = "sortNum")
	private java.lang.Integer sortNum;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
}
