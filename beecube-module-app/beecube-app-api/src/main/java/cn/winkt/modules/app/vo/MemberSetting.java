package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class MemberSetting {
    //新用户获得积分
    private String newMemberIntegral;
    //分享一个新用户老用户得积分
    private String shareIntegral;
    //转发朋友圈获得积分
    private String shareTimelineIntegral;
    //每日转发朋友圈最多获得积分
    private String maxDayShareTimelineIntegral;


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
