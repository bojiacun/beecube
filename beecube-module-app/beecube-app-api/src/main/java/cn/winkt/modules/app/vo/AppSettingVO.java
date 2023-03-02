package cn.winkt.modules.app.vo;

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
 * @Description: 应用配置表
 * @Author: jeecg-boot
 * @Date:   2022-12-19
 * @Version: V1.0
 */
@Data
public class AppSettingVO {
    
	/**id*/
	private String id;
	/**配置标题*/
	private String title;
	/**配置说明*/
	private String description;
	/**配置Key*/
	private String settingKey;
	/**配置值*/
	private String settingValue;
	/**所属APPID*/
	private String appId;
	/**配置分组*/
	private String groupKey;
}
