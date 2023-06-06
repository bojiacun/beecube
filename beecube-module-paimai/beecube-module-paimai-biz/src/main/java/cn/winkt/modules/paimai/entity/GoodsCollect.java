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
 * @Description: 拍你征集表
 * @Author: jeecg-boot
 * @Date:   2023-06-06
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods_collects")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_collects对象", description="拍你征集表")
public class GoodsCollect {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**拍品照片*/
	@Excel(name = "拍品照片", width = 15)
    @ApiModelProperty(value = "拍品照片")
	private java.lang.String classId;
	/**拍品名称*/
	@Excel(name = "拍品名称", width = 15)
    @ApiModelProperty(value = "拍品名称")
	private java.lang.String name;
	/**联系人*/
	@Excel(name = "联系人", width = 15)
    @ApiModelProperty(value = "联系人")
	private java.lang.String contactor;
	/**手机号*/
	@Excel(name = "手机号", width = 15)
    @ApiModelProperty(value = "手机号")
	private java.lang.String phone;
	/**拍品描述*/
	@Excel(name = "拍品描述", width = 15)
    @ApiModelProperty(value = "拍品描述")
	private java.lang.String description;
	/**拍品照片*/
	@Excel(name = "拍品照片", width = 15)
    @ApiModelProperty(value = "拍品照片")
	private java.lang.String image;
	/**createBy*/
	@Excel(name = "createBy", width = 15)
    @ApiModelProperty(value = "createBy")
	private java.lang.String createBy;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
