package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class MemberQuota {
    private Long payCount;
    private Long deliveryCount;
    private Long confirmDeliveryCount;
    private Long ticketCount;
    private Long goodsFollowCount;
    private Long goodsViewCount;
}
