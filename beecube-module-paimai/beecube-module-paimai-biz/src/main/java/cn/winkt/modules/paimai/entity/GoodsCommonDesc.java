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
 * @Description: 拍品公共信息表
 * @Author: jeecg-boot
 * @Date:   2023-02-09
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods_descs")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_descs对象", description="拍品公共信息表")
public class GoodsCommonDesc {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**描述KEY*/
	@Excel(name = "描述KEY", width = 15)
    @ApiModelProperty(value = "描述KEY")
	private java.lang.String descKey;
	/**描述内容*/
	@Excel(name = "描述内容", width = 15)
    @ApiModelProperty(value = "描述内容")
	private java.lang.Object descValue;
	/**描述标题*/
	@Excel(name = "描述标题", width = 15)
    @ApiModelProperty(value = "描述标题")
	private java.lang.String descTitle;
}
