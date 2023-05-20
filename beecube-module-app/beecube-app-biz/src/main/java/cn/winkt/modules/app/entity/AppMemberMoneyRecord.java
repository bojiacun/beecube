package cn.winkt.modules.app.entity;

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
 * @Description: 应用会员余额记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_member_money_records")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_member_money_records对象", description="应用会员余额记录表")
public class AppMemberMoneyRecord {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**记录描述*/
	@Excel(name = "记录描述", width = 15)
    @ApiModelProperty(value = "记录描述")
	private java.lang.String description;
	/**变动金额*/
	@Excel(name = "变动金额", width = 15)
    @ApiModelProperty(value = "变动金额")
	private java.lang.Double money;
	/**记录类型（1支出、2收入、3充值、4提现）*/
	@Excel(name = "记录类型（1支出、2收入、3充值、4提现）", width = 15)
    @ApiModelProperty(value = "记录类型（1支出、2收入、3充值、4提现）")
	@Dict(dicCode = "app_member_money_type")
	private java.lang.Integer type;
	/**会员ID*/
	@Excel(name = "会员ID", width = 15)
    @ApiModelProperty(value = "会员ID")
	private java.lang.String memberId;
	/**产生日期*/
    @ApiModelProperty(value = "产生日期")
	private java.util.Date createTime;

	private Integer status;

	private String transactionId;

	private String appId;
}
