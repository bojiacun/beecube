package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.ChangeMemberScore;
import cn.winkt.modules.app.vo.MemberSetting;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
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
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/notify")
@Slf4j
public class WxAppPayNotifyController {
    @Resource
    IPayLogService payLogService;
    @Resource
    MiniappServices miniappServices;
    @Resource
    IGoodsDepositService goodsDepositService;
    @Resource
    IGoodsOrderService goodsOrderService;
    @Resource
    IOrderGoodsService orderGoodsService;
    @Resource
    IGoodsService goodsService;
    @Resource
    AppApi appApi;



    /**
     * 保证金支付回调
     * @param xmlData
     * @param appId
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @RequestMapping(value = "/deposit/{appId}", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
    @Transactional(rollbackFor = Exception.class)
    public String depositNotify(@RequestBody String xmlData, @PathVariable String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        //这里要设置APPID Context
        AppContext.setApp(appId);
        WxPayService wxPayService = miniappServices.getService(appId);
        final WxPayOrderNotifyResult notifyResult = wxPayService.parseOrderNotifyResult(xmlData);
        notifyResult.checkResult(wxPayService, "MD5", true);

        String outTradeNo = notifyResult.getOutTradeNo();
        PayLog payLog = payLogService.getById(outTradeNo);
        payLog.setPayedAt(new Date());
        payLog.setStatus(true);
        payLog.setTransactionId(notifyResult.getTransactionId());
        payLogService.updateById(payLog);

        GoodsDeposit goodsDeposit = goodsDepositService.getById(payLog.getOrdersn());
        goodsDeposit.setStatus(1);
        goodsDeposit.setTransactionId(notifyResult.getTransactionId());
        goodsDepositService.updateById(goodsDeposit);
        return WxPayNotifyResponse.success("成功");
    }


    /**
     * 一口价支付回调
     * @param xmlData
     * @param appId
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @RequestMapping(value = "/buyout/{appId}", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
    @Transactional(rollbackFor = Exception.class)
    public String notifyGoodsOrder(@RequestBody String xmlData, @PathVariable String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        //这里要设置APPID Context
        AppContext.setApp(appId);
        WxPayService wxPayService = miniappServices.getService(appId);
        final WxPayOrderNotifyResult notifyResult = wxPayService.parseOrderNotifyResult(xmlData);
        notifyResult.checkResult(wxPayService, "MD5", true);

        String outTradeNo = notifyResult.getOutTradeNo();
        PayLog payLog = payLogService.getById(outTradeNo);
        payLog.setPayedAt(new Date());
        payLog.setStatus(true);
        payLog.setTransactionId(notifyResult.getTransactionId());
        payLogService.updateById(payLog);

        GoodsOrder goodsOrder = goodsOrderService.getById(payLog.getOrdersn());
        goodsOrder.setStatus(1);
        goodsOrder.setPayTime(new Date());
        goodsOrder.setTransactionId(notifyResult.getTransactionId());
        goodsOrderService.updateById(goodsOrder);


        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.gt(GoodsOrder::getStatus, 0);
        queryWrapper.eq(GoodsOrder::getMemberId, goodsOrder.getMemberId());
        queryWrapper.gt(GoodsOrder::getCreateTime, DateUtils.todayZeroTime());
        long todayOrders = goodsOrderService.count(queryWrapper);

        //每日首次下单送积分
        MemberSetting memberSetting = appApi.queryMemberSettings(goodsOrder.getMemberId());
        if(todayOrders == 1 && memberSetting != null && StringUtils.isNotEmpty(memberSetting.getBuyIntegral())) {
            ChangeMemberScore changeMemberScore = new ChangeMemberScore();
            changeMemberScore.setAmount(new BigDecimal(memberSetting.getBuyIntegral()));
            changeMemberScore.setMemberId(goodsOrder.getMemberId());
            changeMemberScore.setDescription("每日首单送积分");
            appApi.reduceMemberScore(changeMemberScore);
        }

        //设置下单赠送积分
        if(memberSetting != null && Objects.equals(memberSetting.getConsumeIntegral(), "1")) {
            ChangeMemberScore changeMemberScore = new ChangeMemberScore();
            changeMemberScore.setDescription(String.format("消费送积分, 金额%s", BigDecimal.valueOf(goodsOrder.getPayedPrice()).setScale(2, RoundingMode.CEILING)));
            changeMemberScore.setMemberId(goodsOrder.getMemberId());
            changeMemberScore.setAmount(BigDecimal.valueOf(goodsOrder.getPayedPrice()));
            try {
                appApi.reduceMemberScore(changeMemberScore);
            } catch (Exception ex) {
                log.error(ex.getMessage(), ex);
            }
        }
        return WxPayNotifyResponse.success("成功");
    }

    /**
     * 支付订单回调
     * @param xmlData
     * @param appId
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @RequestMapping(value = "/orders/{appId}", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
    @Transactional(rollbackFor = Exception.class)
    public String notifyGoodsOrderPayed(@RequestBody String xmlData, @PathVariable String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        //这里要设置APPID Context
        AppContext.setApp(appId);
        WxPayService wxPayService = miniappServices.getService(appId);
        final WxPayOrderNotifyResult notifyResult = wxPayService.parseOrderNotifyResult(xmlData);
        notifyResult.checkResult(wxPayService, "MD5", true);

        String outTradeNo = notifyResult.getOutTradeNo();
        PayLog payLog = payLogService.getById(outTradeNo);
        payLog.setPayedAt(new Date());
        payLog.setStatus(true);
        payLog.setTransactionId(notifyResult.getTransactionId());
        payLogService.updateById(payLog);

        GoodsOrder goodsOrder = goodsOrderService.getById(payLog.getOrdersn());
        goodsOrder.setStatus(1);
        goodsOrder.setPayTime(new Date());
        goodsOrder.setTransactionId(notifyResult.getTransactionId());
        goodsOrderService.updateById(goodsOrder);

        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.gt(GoodsOrder::getStatus, 0);
        queryWrapper.eq(GoodsOrder::getMemberId, goodsOrder.getMemberId());
        queryWrapper.gt(GoodsOrder::getCreateTime, DateUtils.todayZeroTime());
        long todayOrders = goodsOrderService.count(queryWrapper);

        //每日首次下单送积分
        MemberSetting memberSetting = appApi.queryMemberSettings(goodsOrder.getMemberId());
        if(todayOrders == 1 && memberSetting != null && StringUtils.isNotEmpty(memberSetting.getBuyIntegral())) {
            ChangeMemberScore changeMemberScore = new ChangeMemberScore();
            changeMemberScore.setAmount(new BigDecimal(memberSetting.getBuyIntegral()));
            changeMemberScore.setMemberId(goodsOrder.getMemberId());
            changeMemberScore.setDescription("每日首单送积分");
            appApi.reduceMemberScore(changeMemberScore);
        }

        //设置下单赠送积分
        if(memberSetting != null && Objects.equals(memberSetting.getConsumeIntegral(), "1")) {
            ChangeMemberScore changeMemberScore = new ChangeMemberScore();
            changeMemberScore.setDescription(String.format("消费送积分, 金额%s", BigDecimal.valueOf(goodsOrder.getPayedPrice()).setScale(2, RoundingMode.CEILING)));
            changeMemberScore.setMemberId(goodsOrder.getMemberId());
            changeMemberScore.setAmount(BigDecimal.valueOf(goodsOrder.getPayedPrice()));
            try {
                appApi.reduceMemberScore(changeMemberScore);
            } catch (Exception ex) {
                log.error(ex.getMessage(), ex);
            }
        }

        return WxPayNotifyResponse.success("成功");
    }
}
