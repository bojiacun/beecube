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
 * @Description: 优惠券
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Data
@TableName("paimai_coupons")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_coupons对象", description="优惠券")
public class Coupon {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**标题*/
	@Excel(name = "标题", width = 15)
    @ApiModelProperty(value = "标题")
	private java.lang.String title;
	/**领取后多少天以后生效*/
	@Excel(name = "领取后多少天以后生效", width = 15)
    @ApiModelProperty(value = "领取后多少天以后生效")
	private java.lang.Integer startDays;
	/**有效期（天）*/
	@Excel(name = "有效期（天）", width = 15)
    @ApiModelProperty(value = "有效期（天）")
	private java.lang.Integer endDays;
	/**目标人群1新用户、2老用户、3已认证用户、4已完善信息用户、5分销商、6全部用户*/
	@Excel(name = "目标人群1新用户、2老用户、3已认证用户、4已完善信息用户、5分销商、6全部用户", width = 15)
    @ApiModelProperty(value = "目标人群1新用户、2老用户、3已认证用户、4已完善信息用户、5分销商、6全部用户")
	@Dict(dicCode = "paimai_coupon_rule_member")
	private java.lang.Integer ruleMember;
	/**适用商品：1按分类、2按商品、3全部商品*/
	@Excel(name = "适用商品：1按分类、2按商品、3全部商品", width = 15)
    @ApiModelProperty(value = "适用商品：1按分类、2按商品、3全部商品")
	@Dict(dicCode = "paimai_coupon_rule_goods")
	private java.lang.Integer ruleGoods;
	/**最低消费*/
	@Excel(name = "最低消费", width = 15)
    @ApiModelProperty(value = "最低消费")
	private java.lang.Float minPrice;
	/**面额*/
	@Excel(name = "面额", width = 15)
    @ApiModelProperty(value = "面额")
	private java.lang.Float amount;
	/**最大发放数量*/
	@Excel(name = "最大发放数量", width = 15)
    @ApiModelProperty(value = "最大发放数量")
	private java.lang.Integer maxCount;
	/**已领取数量*/
	@Excel(name = "已领取数量", width = 15)
    @ApiModelProperty(value = "已领取数量")
	private java.lang.Integer takedCount;
	/**没人限领*/
	@Excel(name = "没人限领", width = 15)
    @ApiModelProperty(value = "没人限领")
	private java.lang.Integer perCount;
	/**status*/
	@Excel(name = "status", width = 15)
    @ApiModelProperty(value = "status")
	@Dict(dicCode = "paimai_show_status")
	private java.lang.Integer status;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
