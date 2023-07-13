package cn.winkt.modules.app.controller.wxapp;

import cn.winkt.modules.app.config.MiniAppPayServices;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import cn.winkt.modules.app.entity.AppPayLog;
import cn.winkt.modules.app.service.IAppMemberMoneyRecordService;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppPayLogService;
import cn.winkt.modules.app.service.IAppSettingService;
import cn.winkt.modules.app.vo.MemberSetting;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.github.binarywang.wxpay.bean.notify.WxPayNotifyResponse;
import com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.util.DateUtils;
import org.jeecg.config.AppContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.Date;

@RestController
@RequestMapping("/api/notify")
@Slf4j
public class WxAppNotifyController {
    @Resource
    private MiniAppPayServices miniAppPayServices;

    @Resource
    private IAppPayLogService appPayLogService;

    @Resource
    private IAppMemberMoneyRecordService appMemberMoneyRecordService;

    @Resource
    private IAppMemberService appMemberService;

    @Resource
    private IAppSettingService appSettingService;
    /**
     *
     * 用户充值回调
     * @param xmlData
     * @param appId
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @RequestMapping(value = "/charge/{appId}", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
    @Transactional(rollbackFor = Exception.class)
    public String chargeNotify(@RequestBody String xmlData, @PathVariable String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        //这里要设置APPID Context
        AppContext.setApp(appId);
        WxPayService wxPayService = miniAppPayServices.getService(appId);
        final WxPayOrderNotifyResult notifyResult = wxPayService.parseOrderNotifyResult(xmlData);
        notifyResult.checkResult(wxPayService, "MD5", true);

        String outTradeNo = notifyResult.getOutTradeNo();
        AppPayLog payLog = appPayLogService.getById(outTradeNo);
        payLog.setPayedAt(new Date());
        payLog.setStatus(true);
        payLog.setTransactionId(notifyResult.getTransactionId());
        appPayLogService.updateById(payLog);

        log.debug("用户充值回调，充值记录ID是 {}", payLog.getOrdersn());
        AppMemberMoneyRecord record = appMemberMoneyRecordService.getById(payLog.getOrdersn());
        MemberSetting memberSetting = appSettingService.queryMemberSettings(AppContext.getApp());
        if(memberSetting != null && StringUtils.isNotEmpty(memberSetting.getRechargeIntegral())) {
            //查看今天是否已经充值
            LambdaQueryWrapper<AppMemberMoneyRecord> recordLambdaQueryWrapper = new LambdaQueryWrapper<>();
            recordLambdaQueryWrapper.eq(AppMemberMoneyRecord::getMemberId, record.getMemberId());
            recordLambdaQueryWrapper.ne(AppMemberMoneyRecord::getId, record.getId());
            recordLambdaQueryWrapper.eq(AppMemberMoneyRecord::getStatus, 1);
            recordLambdaQueryWrapper.ge(AppMemberMoneyRecord::getCreateTime, DateUtils.todayZeroTime());
            recordLambdaQueryWrapper.le(AppMemberMoneyRecord::getCreateTime, DateUtils.todayEndTime());

            if(appMemberMoneyRecordService.count(recordLambdaQueryWrapper) == 0) {
                appMemberService.inScore(record.getMemberId(), new BigDecimal(memberSetting.getRechargeIntegral()), "每日首次充值输送积分");
            }
        }

        record.setStatus(1);
        record.setTransactionId(notifyResult.getTransactionId());
        appMemberMoneyRecordService.updateById(record);

        AppMember appMember = appMemberService.getById(record.getMemberId());
        appMember.setMoney(appMember.getMoney().add(BigDecimal.valueOf(record.getMoney())));
        appMemberService.updateById(appMember);


        return WxPayNotifyResponse.success("成功");
    }
}
