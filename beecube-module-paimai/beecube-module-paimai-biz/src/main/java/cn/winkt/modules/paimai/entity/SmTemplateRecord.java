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
 * @Description: 营销短信发送记录
 * @Author: jeecg-boot
 * @Date:   2023-06-06
 * @Version: V1.0
 */
@Data
@TableName("paimai_sm_templates_records")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_sm_templates_records对象", description="营销短信发送记录")
public class SmTemplateRecord {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**用户ID*/
	@Excel(name = "用户ID", width = 15)
    @ApiModelProperty(value = "用户ID")
	private java.lang.String memberId;
	/**memberName*/
	@Excel(name = "memberName", width = 15)
    @ApiModelProperty(value = "memberName")
	private java.lang.String memberName;
	/**memberAvatar*/
	@Excel(name = "memberAvatar", width = 15)
    @ApiModelProperty(value = "memberAvatar")
	private java.lang.String memberAvatar;
	/**发送手机号*/
	@Excel(name = "发送手机号", width = 15)
    @ApiModelProperty(value = "发送手机号")
	private java.lang.String memberPhone;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**templateId*/
	@Excel(name = "templateId", width = 15)
    @ApiModelProperty(value = "templateId")
	private java.lang.String templateId;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
