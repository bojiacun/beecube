package cn.winkt.modules.paimai.vo;

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
    private String detailServiceAvatar;
    private String detailServiceQrcode;
    private String detailServiceName;
}
