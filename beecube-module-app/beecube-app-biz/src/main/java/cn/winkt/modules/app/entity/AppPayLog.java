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
 * @Description: 支付记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Data
@TableName("beecube_app_pay_logs")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_pay_logs对象", description="支付记录表")
public class AppPayLog {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**createTime*/
    @ApiModelProperty(value = "createTime")
	private java.util.Date createTime;
	/**memberId*/
	@Excel(name = "memberId", width = 15)
    @ApiModelProperty(value = "memberId")
	private java.lang.String memberId;
	/**orderType*/
	@Excel(name = "orderType", width = 15)
    @ApiModelProperty(value = "orderType")
	private java.lang.Integer orderType;
	/**ordersn*/
	@Excel(name = "ordersn", width = 15)
    @ApiModelProperty(value = "ordersn")
	private java.lang.String ordersn;
	/**payedAt*/
    @ApiModelProperty(value = "payedAt")
	private java.util.Date payedAt;
	/**paysn*/
	@Excel(name = "paysn", width = 15)
    @ApiModelProperty(value = "paysn")
	private java.lang.String paysn;
	/**status*/
	@Excel(name = "status", width = 15)
    @ApiModelProperty(value = "status")
	private java.lang.Object status;
	/**transactionId*/
	@Excel(name = "transactionId", width = 15)
    @ApiModelProperty(value = "transactionId")
	private java.lang.String transactionId;
}
