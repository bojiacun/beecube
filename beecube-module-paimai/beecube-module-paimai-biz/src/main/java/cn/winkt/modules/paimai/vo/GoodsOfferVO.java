package cn.winkt.modules.paimai.vo;

import cn.winkt.modules.paimai.entity.Goods;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.jeecgframework.poi.excel.annotation.Excel;

@Data
public class GoodsOfferVO {
    /**id*/
    private java.lang.String id;
    /**出价人ID*/
    private java.lang.String memberId;
    /**出价人*/
    private java.lang.String memberName;
    /**出价人头像*/
    private java.lang.String memberAvatar;
    /**出价*/
    private java.lang.Float price;
    /**出价时间*/
    private java.util.Date offerTime;
    /**拍品ID*/
    private java.lang.String goodsId;
    private java.lang.String performanceId;
    private java.lang.String auctionId;
    private java.lang.String appId;
    private String performanceName;
    private String goodsName;
    private Float goodsMaxOfferPrice;
    private Integer status;

    @TableField(exist = false)
    private Goods goods;
}
