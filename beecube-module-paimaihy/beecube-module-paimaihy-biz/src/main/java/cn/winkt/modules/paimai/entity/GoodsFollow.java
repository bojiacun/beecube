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
@TableName("paimai_goods_follows")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_follows对象", description="关注记录表")
public class GoodsFollow {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**拍品ID*/
	@Excel(name = "拍品ID", width = 15)
    @ApiModelProperty(value = "拍品ID")
	private java.lang.String goodsId;
	@ApiModelProperty(value = "专场ID")
	private java.lang.String performanceId;
	@Excel(name = "拍卖会ID", width = 15)
	@ApiModelProperty(value = "拍卖会ID")
	private java.lang.String auctionId;
	/**关注者名称*/
	@Excel(name = "关注者名称", width = 15)
    @ApiModelProperty(value = "关注者名称")
	private java.lang.String memberName;
	/**关注者ID*/
	@Excel(name = "关注者ID", width = 15)
    @ApiModelProperty(value = "关注者ID")
	private java.lang.String memberId;
	/**关注者头像*/
	@Excel(name = "关注者头像", width = 15)
    @ApiModelProperty(value = "关注者头像")
	private java.lang.String memberAvatar;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	@Excel(name = "应用ID", width = 15)
	@ApiModelProperty(value = "应用ID")
	private java.lang.String appId;
}
