package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class MemberSetting {
    private String newMemberIntegral;
    private String shareIntegral;
    private String authRealIntegral;
    private String rechargeIntegral;
    private String shareMaxIntegral;
    private String signinCycle;
    /**
     * 消费送积分
     */
    private String consumeIntegral;
    private String minWithdrawIntegral;
    private String integralToMoney;
    private String integralRule;
    /**
     * 阅读送积分
     */
    private String readIntegral;

    /**
     * 下单送积分
     */
    private String buyIntegral;
}
