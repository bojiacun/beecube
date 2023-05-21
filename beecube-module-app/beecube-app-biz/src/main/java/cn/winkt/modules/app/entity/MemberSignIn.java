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
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 会员签到
 * @Author: jeecg-boot
 * @Date:   2023-05-21
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_member_signins")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_member_signins对象", description="会员签到")
public class MemberSignIn {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**memberId*/
	@Excel(name = "memberId", width = 15)
    @ApiModelProperty(value = "memberId")
	private java.lang.String memberId;
	/**memberName*/
	@Excel(name = "memberName", width = 15)
    @ApiModelProperty(value = "memberName")
	private java.lang.String memberName;
	/**memberAvatar*/
	@Excel(name = "memberAvatar", width = 15)
    @ApiModelProperty(value = "memberAvatar")
	private java.lang.String memberAvatar;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;

	private Integer dayIndex;
}
