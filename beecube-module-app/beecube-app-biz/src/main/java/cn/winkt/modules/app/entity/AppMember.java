package cn.winkt.modules.app.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonProperty;
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
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
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
	/**分享人ID*/
	@Excel(name = "分享人ID", width = 15)
    @ApiModelProperty(value = "分享人ID")
	private java.lang.String shareId;
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
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private java.lang.String password;
	/**用户余额*/
	@Excel(name = "用户余额", width = 15)
    @ApiModelProperty(value = "用户余额")
	private java.lang.Float money;
	/**用户积分*/
	@Excel(name = "用户积分", width = 15)
    @ApiModelProperty(value = "用户积分")
	private BigDecimal score;
	/**用户手机号*/
	@Excel(name = "用户手机号", width = 15)
    @ApiModelProperty(value = "用户手机号")
	private java.lang.String phone;
	/**邮箱地址*/
	@Excel(name = "邮箱地址", width = 15)
    @ApiModelProperty(value = "邮箱地址")
	private java.lang.String email;
	/**用户昵称*/
	@Excel(name = "用户昵称", width = 15)
    @ApiModelProperty(value = "用户昵称")
	private java.lang.String nickname;

	@Excel(name = "用户真实姓名", width = 15)
	@ApiModelProperty(value = "用户真实姓名")
	private String realname;


	@Excel(name = "用户身份证号", width = 15)
	@ApiModelProperty(value = "用户身份证号")
	private String idCard;


	@Excel(name = "用户身份证正面照", width = 15)
	@ApiModelProperty(value = "用户身份证正面照")
	private String cardFace;

	@Excel(name = "用户身份证反面照", width = 15)
	@ApiModelProperty(value = "用户身份证反面照")
	private String cardBack;

	@Excel(name = "用户实名认证状态0为未认证、1为已认证通过", width = 15)
	@ApiModelProperty(value = "用户实名认证状态0为未认证、1为待审核、2为认证通过")
	@Dict(dicCode = "app_member_auth_status")
	private Integer authStatus;

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
	@Dict(dicCode = "app_member_status")
	private java.lang.Integer status;

	/**
	 * 是否为分销商
	 */
	private Integer isAgent;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
}
