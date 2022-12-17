package cn.winkt.modules.app.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 模块路由映射表
 * @Author: jeecg-boot
 * @Date:   2022-12-17
 * @Version: V1.0
 */
@Data
@TableName("beecube_module_roles")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_module_roles对象", description="模块路由映射表")
public class AppModuleRole {
    
	/**模块ID*/
	@Excel(name = "模块ID", width = 15)
    @ApiModelProperty(value = "模块ID")
	private java.lang.String moduleId;
	/**角色ID*/
	@Excel(name = "角色ID", width = 15)
    @ApiModelProperty(value = "角色ID")
	private java.lang.String roleId;
	/**模块名称*/
	@Excel(name = "模块名称", width = 15)
    @ApiModelProperty(value = "模块名称")
	private java.lang.String moduleName;
	/**角色名称*/
	@Excel(name = "角色名称", width = 15)
    @ApiModelProperty(value = "角色名称")
	private java.lang.String roleName;
}
