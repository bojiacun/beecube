package cn.winkt.modules.paimai.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.jeecg.common.aspect.annotation.Dict;
import org.jeecgframework.poi.excel.annotation.Excel;

@Data
public class GoodsOrderAfterVO {
    /**id*/
    private java.lang.String id;
    /**售后类型（1退货、2换货）*/
    @ApiModelProperty(value = "售后类型（1退货、2换货）")
    private java.lang.Integer type;
    /**创建时间*/
    private java.util.Date createTime;
    /**创建人*/
    private java.lang.String createBy;
    /**售后描述信息*/
    private java.lang.String description;
    /**订单ID*/
    private java.lang.String orderId;
    /**更新时间*/
    private java.util.Date updateTime;
    /**处理人*/
    private java.lang.String updateBy;
    /**状态（0待处理、1已处理、2拒绝）*/
    @Dict(dicCode = "paimai_order_after_status")
    private java.lang.Integer status;
    /**订单商品ID*/
    private java.lang.String orderGoodsId;
    private String goodsName;
    private String goodsImage;
    private java.lang.String appId;
}
