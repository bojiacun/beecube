package cn.winkt.modules.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.jeecg.common.aspect.annotation.Dict;
import org.jeecgframework.poi.excel.annotation.Excel;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("app_registers")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="app_registers对象", description="体验注册")
public class AppMemberRegister {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private String id;
	/**用户手机号*/
	@Excel(name = "用户手机号", width = 15)
    @ApiModelProperty(value = "用户手机号")
	private String mobile;

	@Excel(name = "用户真实姓名", width = 15)
	@ApiModelProperty(value = "用户真实姓名")
	private String realName;

	@Excel(name = "用户身份证号", width = 15)
	@ApiModelProperty(value = "用户身份证号")
	private String cropName;

	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private Date createTime;

	@TableField(exist = false)
	private String code;

}
