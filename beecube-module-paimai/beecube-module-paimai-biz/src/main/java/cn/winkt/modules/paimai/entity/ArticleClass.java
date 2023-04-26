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
 * @Description: 文章分类表
 * @Author: jeecg-boot
 * @Date:   2023-03-14
 * @Version: V1.0
 */
@Data
@TableName("paimai_article_classes")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_article_classes对象", description="文章分类表")
public class ArticleClass {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**分类名称*/
	@Excel(name = "分类名称", width = 15)
    @ApiModelProperty(value = "分类名称")
	private java.lang.String name;

	@Dict(dicCode = "paimai_article_type")
	private Integer type;
	/**分类排序*/
	@Excel(name = "分类排序", width = 15)
    @ApiModelProperty(value = "分类排序")
	private java.lang.Integer sortNum;
	/**分类状态0不显示、1显示*/
	@Excel(name = "分类状态0不显示、1显示", width = 15)
    @ApiModelProperty(value = "分类状态0不显示、1显示")
	@Dict(dicCode = "paimai_article_class_status")
	private java.lang.Integer status;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
