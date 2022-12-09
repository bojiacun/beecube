package cn.winkt.modules.app.vo;

import lombok.Data;


@Data
public class AppGateway {
    private String routerId;
    private String name;
    private String uri;
    private Integer status;
    private AppGatewayPredicate[] predicates;
    private AppGatewayFilter[] filters;
}


@Data
class AppGatewayPredicate {
    private String name;
    private String[] args;
}

@Data
class AppGatewayFilter {
    private AppGatewayFilterItem[] args;
}

@Data
class AppGatewayFilterItem {
    private String key;
    private String value;
}