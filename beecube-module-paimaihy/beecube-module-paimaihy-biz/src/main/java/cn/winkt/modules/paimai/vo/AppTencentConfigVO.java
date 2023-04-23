package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class AppTencentConfigVO {
    private String pushDomain;
    private String appName;
    private String pushTxtSecret;
    private String playDomain;
    private String playTxtSecret;
    private String pushSchema;

    private String playSchema;
}

