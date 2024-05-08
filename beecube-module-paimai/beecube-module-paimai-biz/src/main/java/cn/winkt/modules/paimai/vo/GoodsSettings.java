package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class GoodsSettings {
    private String integralRatio;
    private String requireRealAuth;
    private String orderNotPayTemplateId;
    private String orderNotPayTemplateArgs;
    private String requireMemberMobile;
    private String lianluCorpId;
    private String lianluAppId;
    private String lianluAppKey;
    private String lianluSignName;
    private String descFlow;
    private String descDelivery;
    private String descNotice;
    private String descRead;
    private String descDeposit;
}
