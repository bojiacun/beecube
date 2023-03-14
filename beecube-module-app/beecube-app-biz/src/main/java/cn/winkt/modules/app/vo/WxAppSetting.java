package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class WxAppSetting {
    private String appid;
    private String appsecret;
    private String merchId;
    private String merchSecret;
    private String apiclientCert;
    private String apiclientP12;
    private String apiclientKey;
}
