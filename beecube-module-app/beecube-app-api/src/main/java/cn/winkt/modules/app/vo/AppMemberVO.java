package cn.winkt.modules.app.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.jeecgframework.poi.excel.annotation.Excel;

import java.util.Date;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
public class AppMemberVO {
    
	/**id*/

	private String id;
	/**应用ID*/
	private String appId;
	/**分享人ID*/
	private String shareId;
	/**微信公众号OPENID*/
	private String wechatOpenid;
	/**微信小程序OPENID*/
	private String wxappOpenid;
	/**微信联合ID*/
	private String wechatUnionid;
	/**抖音OPENID*/
	private String douyinOpenid;
	/**钉钉OPENID*/
	private String dingdingOpenid;
	/**用户名*/
	private String username;
	/**登录密码*/
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;
	/**用户余额*/
	private Float money;
	/**用户积分*/
	private Float score;
	/**用户手机号*/
	private String phone;
	/**邮箱地址*/
	private String email;
	/**用户昵称*/
	private String nickname;
	private String realname;

	private String idCard;

	private String cardFace;

	private String cardBack;

	private Integer authStatus;

	/**用户头像*/
	private String avatar;
	/**用户性别*/
	private Integer sex;
	/**地址信息*/
	private String address;
	/**用户状态1为正常，0为禁用*/
	private Integer status;
	/**创建时间*/
	private Date createTime;
}
