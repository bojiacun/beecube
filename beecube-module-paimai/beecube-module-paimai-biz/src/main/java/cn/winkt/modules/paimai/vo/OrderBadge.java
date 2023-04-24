package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class OrderBadge {
    private Long payCount;
    private Long deliveryCount;
    private Long confirmDeliveryCount;
}
