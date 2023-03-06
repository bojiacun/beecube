package cn.winkt.modules.paimai.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.jeecg.common.aspect.annotation.Dict;
import org.jeecgframework.poi.excel.annotation.Excel;

@Data
public class GoodsVO {
    private java.lang.String id;
    private java.lang.String classId;
    private java.lang.String title;
    private java.lang.String subTitle;
    private java.lang.Integer type;
    private java.lang.Float deposit;
    private java.lang.Float startPrice;
    private java.lang.Object uprange;
    private java.lang.Integer delayTime;
    private java.lang.Object commission;
    private java.lang.String performanceId;
    private String performanceTitle;
    private java.lang.Float performanceDeposit;
    private java.util.Date endTime;
    private java.lang.Object fields;

    private java.lang.String description;
    /**拍品流程*/

    private java.lang.String descFlow;
    /**物流运输*/

    private java.lang.String descDelivery;
    /**注意事项*/

    private java.lang.String descNotice;
    /**拍卖须知*/

    private java.lang.String descRead;
    /**保证金说明*/

    private java.lang.String descDeposit;
    /**创建时间*/

    private java.util.Date createTime;
    /**创建人*/

    private java.lang.String createBy;
    /**更新时间*/

    private java.util.Date updateTime;
    /**更新时间*/

    private java.lang.String updateBy;
    /**应用ID*/

    private java.lang.String appId;
    /**实际结束时间*/

    private java.util.Date actualEndTime;
    /**图片*/

    private java.lang.String images;
    /**状态（0下架1上架）*/
    private java.lang.Integer status;

    private Integer count;

    private Integer viewCount;
    private Integer offerCount;
    private Integer followCount;
    private Boolean followed;
    private Float currentPrice;
    private Integer depositCount;
}
