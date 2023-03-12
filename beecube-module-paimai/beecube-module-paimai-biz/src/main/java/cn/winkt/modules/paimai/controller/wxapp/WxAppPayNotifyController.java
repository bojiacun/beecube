package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.entity.PayLog;
import cn.winkt.modules.paimai.service.IGoodsDepositService;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
import cn.winkt.modules.paimai.service.IPayLogService;
import com.github.binarywang.wxpay.bean.notify.WxPayNotifyResponse;
import com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import org.jeecg.config.AppContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;

@RestController
@RequestMapping("/paimai/api/notify")
public class WxAppPayNotifyController {
    @Resource
    IPayLogService payLogService;
    @Resource
    MiniappServices miniappServices;
    @Resource
    IGoodsDepositService goodsDepositService;
    @Resource
    IGoodsOrderService goodsOrderService;
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
    @Transactional
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
    @Transactional
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
    @Transactional
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
        return WxPayNotifyResponse.success("成功");
    }
}
