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
import org.jeecg.common.aspect.annotation.Dict;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 直播间表
 * @Author: jeecg-boot
 * @Date:   2023-04-04
 * @Version: V1.0
 */
@Data
@TableName("paimai_live_rooms")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_live_rooms对象", description="直播间表")
public class LiveRoom {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**直播间名称*/
	@Excel(name = "直播间名称", width = 15)
    @ApiModelProperty(value = "直播间名称")
	private java.lang.String title;
	/**直播间预览图*/
	@Excel(name = "直播间预览图", width = 15)
    @ApiModelProperty(value = "直播间预览图")
	private java.lang.String preview;
	/**直播开始时间*/
    @ApiModelProperty(value = "直播开始时间")
	private java.util.Date startTime;
	/**直播结束时间*/
    @ApiModelProperty(value = "直播结束时间")
	private java.util.Date endTime;
	/**观看人次*/
	@Excel(name = "观看人次", width = 15)
    @ApiModelProperty(value = "观看人次")
	private java.lang.Integer views;
	/**点赞数*/
	@Excel(name = "点赞数", width = 15)
    @ApiModelProperty(value = "点赞数")
	private java.lang.Integer stars;
	/**直播间显示状态0为不显示、1为显示*/
	@Excel(name = "直播间显示状态0为不显示、1为显示", width = 15)
    @ApiModelProperty(value = "直播间显示状态0为不显示、1为显示")
	@Dict(dicCode = "paimai_room_status")
	private java.lang.Integer status;
	/**创建时间*/
    @ApiModelProperty(value = "创建时间")
	private java.util.Date createTime;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
