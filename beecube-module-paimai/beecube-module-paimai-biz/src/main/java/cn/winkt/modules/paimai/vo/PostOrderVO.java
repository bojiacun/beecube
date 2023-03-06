package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class PostOrderVO {
    private GoodsVO[] goodsList;
    private AddressVO address;
}
