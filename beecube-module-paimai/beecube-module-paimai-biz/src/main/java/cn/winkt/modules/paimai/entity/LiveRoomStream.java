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
 * @Description: 直播间视频流信息表
 * @Author: jeecg-boot
 * @Date:   2023-04-19
 * @Version: V1.0
 */
@Data
@TableName("paimai_live_room_streams")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="paimai_live_room_streams对象", description="直播间视频流信息表")
public class LiveRoomStream {
    
	/**id*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
	private java.lang.String id;
	/**推送地址*/
	@Excel(name = "推送地址", width = 15)
    @ApiModelProperty(value = "推送地址")
	private java.lang.String pushAddress;
	/**拉取地址*/
	@Excel(name = "拉取地址", width = 15)
    @ApiModelProperty(value = "拉取地址")
	private java.lang.String playAddress;
	/**liveId*/
	@Excel(name = "liveId", width = 15)
    @ApiModelProperty(value = "liveId")
	private java.lang.String liveId;
	/**流显示控制0不显示、1显示*/
	@Excel(name = "流显示控制0不显示、1显示", width = 15)
    @ApiModelProperty(value = "流显示控制0不显示、1显示")
	private java.lang.Integer status;
	/**appId*/
	@Excel(name = "appId", width = 15)
    @ApiModelProperty(value = "appId")
	private java.lang.String appId;
}
