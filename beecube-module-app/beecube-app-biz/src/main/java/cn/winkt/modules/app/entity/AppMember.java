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
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2022-12-18
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_members")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_members对象", description="应用会员表")
public class AppMember {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**应用ID*/
	@Excel(name = "应用ID", width = 15)
    @ApiModelProperty(value = "应用ID")
	private java.lang.String appId;
	/**微信公众号OPENID*/
	@Excel(name = "微信公众号OPENID", width = 15)
    @ApiModelProperty(value = "微信公众号OPENID")
	private java.lang.String wechatOpenid;
	/**微信小程序OPENID*/
	@Excel(name = "微信小程序OPENID", width = 15)
    @ApiModelProperty(value = "微信小程序OPENID")
	private java.lang.String wxappOpenid;
	/**微信联合ID*/
	@Excel(name = "微信联合ID", width = 15)
    @ApiModelProperty(value = "微信联合ID")
	private java.lang.String wechatUnionid;
	/**抖音OPENID*/
	@Excel(name = "抖音OPENID", width = 15)
    @ApiModelProperty(value = "抖音OPENID")
	private java.lang.String douyinOpenid;
	/**钉钉OPENID*/
	@Excel(name = "钉钉OPENID", width = 15)
    @ApiModelProperty(value = "钉钉OPENID")
	private java.lang.String dingdingOpenid;
	/**用户名*/
	@Excel(name = "用户名", width = 15)
    @ApiModelProperty(value = "用户名")
	private java.lang.String username;
	/**登录密码*/
	@Excel(name = "登录密码", width = 15)
    @ApiModelProperty(value = "登录密码")
	private java.lang.String password;
	/**用户手机号*/
	@Excel(name = "用户手机号", width = 15)
    @ApiModelProperty(value = "用户手机号")
	private java.lang.String mobile;
	/**用户昵称*/
	@Excel(name = "用户昵称", width = 15)
    @ApiModelProperty(value = "用户昵称")
	private java.lang.String nickname;
	/**用户头像*/
	@Excel(name = "用户头像", width = 15)
    @ApiModelProperty(value = "用户头像")
	private java.lang.String avatar;
	/**用户性别*/
	@Excel(name = "用户性别", width = 15)
    @ApiModelProperty(value = "用户性别")
	private java.lang.Integer sex;
	/**地址信息*/
	@Excel(name = "地址信息", width = 15)
    @ApiModelProperty(value = "地址信息")
	private java.lang.String address;
	/**用户状态1为正常，0为禁用*/
	@Excel(name = "用户状态1为正常，0为禁用", width = 15)
    @ApiModelProperty(value = "用户状态1为正常，0为禁用")
	private java.lang.Integer status;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
}
