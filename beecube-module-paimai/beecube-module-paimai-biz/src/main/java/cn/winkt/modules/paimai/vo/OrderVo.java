package cn.winkt.modules.paimai.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrderVo implements Serializable {

    private String id;
    private java.lang.String goodsId;
    private String goodsName;
    private String goodsImage;
    private Integer goodsCount;
    private java.lang.String goodsOfferId;
    private java.lang.String memberId;
    private java.lang.String memberName;
    private java.lang.String memberAvatar;
    private java.lang.String deliveryInfo;
    private java.util.Date createTime;
    private java.util.Date updateTime;
    private java.util.Date payTime;
    private java.lang.Integer status;
    private java.lang.Float payedPrice;
    private java.lang.Float totalPrice;
    private java.lang.String createBy;
    private java.lang.String updateBy;
    private java.lang.String appId;
}
