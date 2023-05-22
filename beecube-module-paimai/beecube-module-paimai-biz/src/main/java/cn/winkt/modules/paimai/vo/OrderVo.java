package cn.winkt.modules.paimai.vo;

import cn.winkt.modules.paimai.entity.OrderGoods;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class OrderVo implements Serializable {

    private String id;
    private java.lang.String goodsId;
    private String goodsName;
    private String goodsImages;
    private Integer goodsCount;
    private Integer goodsType;
    private java.lang.String goodsOfferId;
    private java.lang.String memberId;
    private java.lang.String memberName;
    private java.lang.String memberAvatar;
    private java.lang.String deliveryInfo;
    private java.util.Date createTime;
    private java.util.Date updateTime;
    private java.util.Date payTime;
    private java.lang.Integer status;
    private BigDecimal payedPrice;
    private BigDecimal totalPrice;
    private java.lang.String createBy;
    private java.lang.String updateBy;
    private java.lang.String appId;
    private OrderGoods[] orderGoods;
    private String couponId;
    private String useIntegral;
    private BigDecimal deliveryPrice;
}
