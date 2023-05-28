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
 * @Description: 拍卖任务表
 * @Author: jeecg-boot
 * @Date:   2023-05-28
 * @Version: V1.0
 */
@Data
@TableName("paimai_day_tasks")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_day_tasks对象", description="拍卖任务表")
public class DayTask {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**任务类型：1每日阅读、2每日下单、3每日充值*/
	@Excel(name = "任务类型：1每日阅读、2每日下单、3每日充值", width = 15)
    @ApiModelProperty(value = "任务类型：1每日阅读、2每日下单、3每日充值")
	private java.lang.Integer type;
	/**会员ID*/
	@Excel(name = "会员ID", width = 15)
    @ApiModelProperty(value = "会员ID")
	private java.lang.String memberId;
	/**会员名称*/
	@Excel(name = "会员名称", width = 15)
    @ApiModelProperty(value = "会员名称")
	private java.lang.String memberName;
	/**会员头像*/
	@Excel(name = "会员头像", width = 15)
    @ApiModelProperty(value = "会员头像")
	private java.lang.String memberAvatar;
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
