package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class ZegoSetting {
    private String zegoAppId;
    private String zegoServerAddress;
    private String zegoLogUrl;
    private String zegoAppSign;
    private String zegoServerSecret;
    private String zegoCallbackSecret;
}
