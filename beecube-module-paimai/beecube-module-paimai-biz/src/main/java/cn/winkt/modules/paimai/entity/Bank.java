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
 * @Description: 银行信息
 * @Author: jeecg-boot
 * @Date:   2023-05-30
 * @Version: V1.0
 */
@Data
@TableName("paimai_banks")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_banks对象", description="银行信息")
public class Bank {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**银行行名称*/
	@Excel(name = "银行行名称", width = 15)
    @ApiModelProperty(value = "银行行名称")
	private java.lang.String bankName;
	/**银行行地址*/
	@Excel(name = "银行行地址", width = 15)
    @ApiModelProperty(value = "银行行地址")
	private java.lang.String bankAddress;
	/**银行卡号*/
	@Excel(name = "银行卡号", width = 15)
    @ApiModelProperty(value = "银行卡号")
	private java.lang.String bankCode;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
