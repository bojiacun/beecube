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
 * @Description: 应用管理员表
 * @Author: jeecg-boot
 * @Date:   2022-12-18
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_users")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_users对象", description="应用管理员表")
public class AppUser {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**APPID*/
	@Excel(name = "APPID", width = 15)
    @ApiModelProperty(value = "APPID")
	private java.lang.String appId;
	/**绑定的管理员ID*/
	@Excel(name = "绑定的管理员ID", width = 15)
    @ApiModelProperty(value = "绑定的管理员ID")
	private java.lang.String userId;
	/**绑定的管理员用户名*/
	@Excel(name = "绑定的管理员用户名", width = 15)
    @ApiModelProperty(value = "绑定的管理员用户名")
	private java.lang.String username;
}
