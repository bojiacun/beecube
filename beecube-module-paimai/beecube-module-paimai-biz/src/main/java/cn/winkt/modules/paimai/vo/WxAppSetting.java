package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class WxAppSetting {
    private String appId;
    private String appSecret;
    private String merchId;
    private String merchSecret;
    private String apiclientCert;
    private String apiclientP12;
    private String apiclientKey;
}
