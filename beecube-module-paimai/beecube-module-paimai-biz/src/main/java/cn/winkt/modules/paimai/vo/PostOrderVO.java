package cn.winkt.modules.paimai.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PostOrderVO {
    private GoodsVO[] goodsList;
    private AddressVO address;
    private String ticketId;
    private BigDecimal ticketAmount;
    private BigDecimal useIntegral;
    private BigDecimal deliveryPrice;
    private BigDecimal payedPrice;
    private Integer payType;
}
