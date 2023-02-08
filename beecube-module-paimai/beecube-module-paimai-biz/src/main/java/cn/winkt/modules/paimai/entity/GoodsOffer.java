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
 * @Description: 出价记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("paimai_goods_offers")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_goods_offers对象", description="出价记录表")
public class GoodsOffer {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**出价人ID*/
	@Excel(name = "出价人ID", width = 15)
    @ApiModelProperty(value = "出价人ID")
	private java.lang.String memberId;
	/**出价人*/
	@Excel(name = "出价人", width = 15)
    @ApiModelProperty(value = "出价人")
	private java.lang.String memberName;
	/**出价人头像*/
	@Excel(name = "出价人头像", width = 15)
    @ApiModelProperty(value = "出价人头像")
	private java.lang.String memberAvatar;
	/**出价*/
	@Excel(name = "出价", width = 15)
    @ApiModelProperty(value = "出价")
	private java.lang.Float price;
	/**出价时间*/
    @ApiModelProperty(value = "出价时间")
	private java.util.Date offerTime;
	/**拍品ID*/
	@Excel(name = "拍品ID", width = 15)
    @ApiModelProperty(value = "拍品ID")
	private java.lang.String goodsId;
}
