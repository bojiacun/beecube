package cn.winkt.modules.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 微信开放平台配置表
 * @Author: jeecg-boot
 * @Date:   2023-04-01
 * @Version: V1.0
 */
@Data
@TableName("beecube_tencent_configs")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_tencent_configs", description="腾讯云配置表")
public class AppTencentConfig {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private String id;
	/**配置Key*/
	@Excel(name = "配置Key", width = 15)
    @ApiModelProperty(value = "配置Key")
	private String settingKey;
	/**配置值*/
	@Excel(name = "配置值", width = 15)
    @ApiModelProperty(value = "配置值")
	private String settingValue;
	/**配合标题*/
	@Excel(name = "配合标题", width = 15)
    @ApiModelProperty(value = "配合标题")
	private String title;
}
