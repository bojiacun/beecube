package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
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
import org.jeecg.config.AppContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/paimai/api/notify")
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

        //分销佣金
        try {
            AppMemberVO buyer = appApi.getMemberById(goodsOrder.getMemberId());
            if (buyer != null && StringUtils.isNotEmpty(buyer.getShareId())) {
                AppMemberVO sharer = appApi.getMemberById(buyer.getShareId());
                if(sharer != null && sharer.getIsAgent() == 1) {
                    //是分销商，则给分销商返点
                    BigDecimal amount = BigDecimal.ZERO;
                    LambdaQueryWrapper<OrderGoods> queryWrapper = new LambdaQueryWrapper<>();
                    queryWrapper.eq(OrderGoods::getOrderId, goodsOrder.getId());
                    List<OrderGoods> orderGoodsList = orderGoodsService.list(queryWrapper);
                    for (OrderGoods orderGoods : orderGoodsList) {
                        Goods goods = goodsService.getById(orderGoods.getGoodsId());
                        if(goods.getCommission() != null) {
                            //计算分佣返点
                            BigDecimal goodsTotalPrice = BigDecimal.valueOf(orderGoods.getGoodsPrice()).multiply(BigDecimal.valueOf(orderGoods.getGoodsCount()));
                            amount = amount.add(BigDecimal.valueOf(goods.getCommission()).multiply(goodsTotalPrice).divide(BigDecimal.valueOf(100), RoundingMode.CEILING));
                        }
                    }
                    appApi.addMemberMoney(sharer.getId(), String.format("分销返佣, 单号为 %s", goodsOrder.getId()), amount.floatValue());
                }
            }
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
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
