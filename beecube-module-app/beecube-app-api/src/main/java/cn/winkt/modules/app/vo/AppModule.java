package cn.winkt.modules.app.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @Description: 应用模块
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Data
public class AppModule {
    
	/**模块ID*/

	private String id;
	/**模块标识*/

	private String identify;
	/**模块名称*/

	private String name;
	/**模块LOGO*/

	private String logo;
	/**0为未安装1已安装2已卸载*/

	private Integer status;
	/**模块作者*/

	private String author;
	/**版本号*/

	private String version;

	private String newVersion;
	/**是否支持h5*/

	private Integer supportH5;
	/**是否支持微信小程序*/

	private Integer supportWechat;
	/**是否支持抖音小程序*/

	private Integer supportDouyin;
	/**安装信息*/

	private String manifest;
	/**模块注册时间*/

	private Date createTime;
}
