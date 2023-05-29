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
 * @Description: 发票申请表
 * @Author: jeecg-boot
 * @Date:   2023-05-29
 * @Version: V1.0
 */
@Data
@TableName("paimai_fapiao_orders")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_fapiao_orders对象", description="发票申请表")
public class FapiaoOrder {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**申请金额*/
	@Excel(name = "申请金额", width = 15)
    @ApiModelProperty(value = "申请金额")
	private java.lang.Float amount;
	/**申请人*/
	@Excel(name = "申请人", width = 15)
    @ApiModelProperty(value = "申请人")
	private java.lang.String memberId;
	/**申请人姓名*/
	@Excel(name = "申请人姓名", width = 15)
    @ApiModelProperty(value = "申请人姓名")
	private java.lang.String memberName;
	/**申请人头像*/
	@Excel(name = "申请人头像", width = 15)
    @ApiModelProperty(value = "申请人头像")
	private java.lang.String memberAvatar;
	/**开票订单ID集合*/
	@Excel(name = "开票订单ID集合", width = 15)
    @ApiModelProperty(value = "开票订单ID集合")
	private java.lang.String orderIds;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**updateBy*/
	@Excel(name = "updateBy", width = 15)
    @ApiModelProperty(value = "updateBy")
	private java.lang.String updateBy;
	/**申请状态0为拒绝、1为审核中、2为已开票*/
	@Excel(name = "申请状态0为拒绝、1为审核中、2为已开票", width = 15)
    @ApiModelProperty(value = "申请状态0为拒绝、1为审核中、2为已开票")
	private java.lang.Integer status;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
