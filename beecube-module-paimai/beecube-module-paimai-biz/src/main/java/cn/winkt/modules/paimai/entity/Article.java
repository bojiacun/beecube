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
 * @Description: 文章表
 * @Author: jeecg-boot
 * @Date:   2023-03-13
 * @Version: V1.0
 */
@Data
@TableName("paimai_articles")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_articles对象", description="文章表")
public class Article {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**文章标题*/
	@Excel(name = "文章标题", width = 15)
    @ApiModelProperty(value = "文章标题")
	private java.lang.String title;
	/**文章描述*/
	@Excel(name = "文章描述", width = 15)
    @ApiModelProperty(value = "文章描述")
	private java.lang.String description;
	/**文章正文*/
	@Excel(name = "文章正文", width = 15)
    @ApiModelProperty(value = "文章正文")
	private java.lang.Object content;
	/**文章预览图片*/
	@Excel(name = "文章预览图片", width = 15)
    @ApiModelProperty(value = "文章预览图片")
	private java.lang.String preview;
	/**文章视频*/
	@Excel(name = "文章视频", width = 15)
    @ApiModelProperty(value = "文章视频")
	private java.lang.String video;
	/**文章类型1为图文、2为视频*/
	@Excel(name = "文章类型1为图文、2为视频", width = 15)
    @ApiModelProperty(value = "文章类型1为图文、2为视频")
	@Dict(dicCode = "paimai_article_type")
	private java.lang.Integer type;
	/**文章创建时间*/
    @ApiModelProperty(value = "文章创建时间")
	private java.util.Date createTime;
	/**创建人*/
	@Excel(name = "创建人", width = 15)
    @ApiModelProperty(value = "创建人")
	private java.lang.String createBy;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
	@Excel(name = "状态（0下架1上架)", width = 15)
	@ApiModelProperty(value = "状态（0下架1上架)")
	@Dict(dicCode = "paimai_article_status")
	private java.lang.Integer status;
}
