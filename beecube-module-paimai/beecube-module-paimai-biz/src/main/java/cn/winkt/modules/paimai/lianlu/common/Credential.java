package cn.winkt.modules.paimai.lianlu.common;

public class Credential {
    private String MchId;
    private String AppId;
    private String AppKey;
    private boolean isHttp;

    public Credential() {
    }

    public Credential(String MchId, String AppId, String AppKey) {
        this.MchId = MchId;
        this.AppId = AppId;
        this.AppKey = AppKey;
        this.isHttp = false;
    }

    public Credential(String MchId, String AppId, String AppKey, boolean isHttp) {
        this.MchId = MchId;
        this.AppId = AppId;
        this.AppKey = AppKey;
        this.isHttp = isHttp;
    }

    public  void setIsHttp(boolean isHttp) {
        this.isHttp = isHttp;
    }

    public void setMchId(String MchId) {
        this.MchId = MchId;
    }

    public void setAppId(String AppId) {
        this.AppId = AppId;
    }

    public void setAppKey(String AppKey) {
        this.AppKey = AppKey;
    }

    public String getMchId() {
        return this.MchId;
    }

    public String getAppId() {
        return this.AppId;
    }

    public String getAppKey() {
        return this.AppKey;
    }

    public boolean isHttp() {
        return this.isHttp;
    }
}
