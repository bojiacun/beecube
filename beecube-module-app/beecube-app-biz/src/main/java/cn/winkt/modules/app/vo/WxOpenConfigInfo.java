package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class WxOpenConfigInfo {

    private String componentAppId;
    private String componentAppSecret;
    private String componentToken;
    private String componentAesKey;
    private String componentVerifyTicket;
}
