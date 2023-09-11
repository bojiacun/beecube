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
 * @Description: 营销短信模板表
 * @Author: jeecg-boot
 * @Date:   2023-06-06
 * @Version: V1.0
 */
@Data
@TableName("paimai_sm_templates")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_sm_templates对象", description="营销短信模板表")
public class SmTemplate {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**模板名称*/
	@Excel(name = "模板名称", width = 15)
    @ApiModelProperty(value = "模板名称")
	private java.lang.String title;
	/**腾讯云短信模板ID*/
	@Excel(name = "腾讯云短信模板ID", width = 15)
    @ApiModelProperty(value = "腾讯云短信模板ID")
	private java.lang.String templateId;
	/**变量替换*/
	@Excel(name = "变量替换", width = 15)
    @ApiModelProperty(value = "变量替换")
	private java.lang.String vars;
	/**目标用户：1为部分用户、2为全部用户*/
	@Excel(name = "目标用户：1为部分用户、2为全部用户", width = 15, dicCode = "winkt_smt_rulemember")
    @ApiModelProperty(value = "目标用户：1为部分用户、2为全部用户")
	@Dict(dicCode = "paimai_smt_rule_member")
	private java.lang.Integer ruleMember;
	/**部分用户ID集合*/
	@Excel(name = "部分用户ID集合", width = 15)
    @ApiModelProperty(value = "部分用户ID集合")
	private java.lang.String ruleMemberIds;
	@TableField(exist = false)
	private String ruleMemberIds_dictText;
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

	private String url;

	private String lastErrorMessage;
}
