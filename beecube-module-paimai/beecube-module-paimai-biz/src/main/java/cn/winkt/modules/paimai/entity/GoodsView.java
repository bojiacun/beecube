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
 * @Description: 围观记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods_views")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_views对象", description="围观记录表")
public class GoodsView {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**拍品ID*/
	@Excel(name = "拍品ID", width = 15)
    @ApiModelProperty(value = "拍品ID")
	private java.lang.String goodsId;
	/**围观者名称*/
	@Excel(name = "围观者名称", width = 15)
    @ApiModelProperty(value = "围观者名称")
	private java.lang.String memberName;
	/**围观者ID*/
	@Excel(name = "围观者ID", width = 15)
    @ApiModelProperty(value = "围观者ID")
	private java.lang.String memberId;
	/**围观者头像*/
	@Excel(name = "围观者头像", width = 15)
    @ApiModelProperty(value = "围观者头像")
	private java.lang.String memberAvatar;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	@Excel(name = "应用ID", width = 15)
	@ApiModelProperty(value = "应用ID")
	private java.lang.String appId;
}
