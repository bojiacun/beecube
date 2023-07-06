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

import java.math.BigDecimal;

@Data
@TableName("beecube_app_member_share_records")
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="beecube_app_member_share_records", description="用户转发记录表")
public class AppMemberShareRecord {
    @TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "id")
    private java.lang.String id;
    /**应用ID*/
    @Excel(name = "应用ID", width = 15)
    @ApiModelProperty(value = "应用ID")
    private java.lang.String appId;

    @ApiModelProperty(value = "获得的积分")
    private BigDecimal score;

    @Excel(name = "会员ID", width = 15)
    @ApiModelProperty(value = "会员ID")
    private java.lang.String memberId;
    @ApiModelProperty(value = "产生日期")
    private java.util.Date createTime;
}
