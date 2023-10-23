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
 * @Description: 竞买人
 * @Author: jeecg-boot
 * @Date:   2023-10-23
 * @Version: V1.0
 */
@Data
@TableName("paimai_bidders")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_bidders对象", description="竞买人")
public class PaimaiBidder {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**memberId*/
	@Excel(name = "memberId", width = 15)
    @ApiModelProperty(value = "memberId")
	private java.lang.String memberId;
	/**memberAvatar*/
	@Excel(name = "memberAvatar", width = 15)
    @ApiModelProperty(value = "memberAvatar")
	private java.lang.String memberAvatar;
	/**memberName*/
	@Excel(name = "memberName", width = 15)
    @ApiModelProperty(value = "memberName")
	private java.lang.String memberName;
	/**cardCode*/
	@Excel(name = "cardCode", width = 15)
    @ApiModelProperty(value = "cardCode")
	private java.lang.String cardCode;
	/**realName*/
	@Excel(name = "realName", width = 15)
    @ApiModelProperty(value = "realName")
	private java.lang.String realName;
	/**phone*/
	@Excel(name = "phone", width = 15)
    @ApiModelProperty(value = "phone")
	private java.lang.String phone;
	/**performanceId*/
	@Excel(name = "performanceId", width = 15)
    @ApiModelProperty(value = "performanceId")
	private java.lang.String performanceId;
	private java.lang.String roomId;
	/**goodsId*/
	@Excel(name = "goodsId", width = 15)
    @ApiModelProperty(value = "goodsId")
	private java.lang.String goodsId;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
