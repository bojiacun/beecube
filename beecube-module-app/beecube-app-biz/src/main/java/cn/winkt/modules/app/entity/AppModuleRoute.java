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
 * @Description: 模块路由映射表
 * @Author: jeecg-boot
 * @Date:   2022-12-17
 * @Version: V1.0
 */
@Data
@TableName("beecube_module_routes")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_module_routes对象", description="模块路由映射表")
public class AppModuleRoute {
    
	/**模块ID*/
	@Excel(name = "模块ID", width = 15)
    @ApiModelProperty(value = "模块ID")
	private java.lang.String moduleId;
	/**路由ID*/
	@Excel(name = "路由ID", width = 15)
    @ApiModelProperty(value = "路由ID")
	private java.lang.String routerId;
	/**模块名称*/
	@Excel(name = "模块名称", width = 15)
    @ApiModelProperty(value = "模块名称")
	private java.lang.String moduleName;
	/**路由名称*/
	@Excel(name = "路由名称", width = 15)
    @ApiModelProperty(value = "路由名称")
	private java.lang.String routerName;
}
