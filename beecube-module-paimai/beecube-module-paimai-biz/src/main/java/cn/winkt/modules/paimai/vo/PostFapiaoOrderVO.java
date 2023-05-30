package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class PostFapiaoOrderVO {
    private AddressVO address;
    private String title;
    private String taxCode;
    private java.lang.Integer type;
    private java.lang.String orderIds;
    private String email;
}
