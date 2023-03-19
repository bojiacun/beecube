package cn.winkt.modules.paimai.service;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.message.GoodsUpdateMessage;
import cn.winkt.modules.paimai.message.MessageConstant;
import cn.winkt.modules.paimai.message.OfferMessage;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class AuctionRunJobHandler {
    @Resource
    private IGoodsService goodsService;

    @Resource
    private IGoodsOfferService goodsOfferService;

    @Resource
    private IGoodsDepositService goodsDepositService;

    @Resource
    private IGoodsOrderService goodsOrderService;

    @Resource
    private IOrderGoodsService orderGoodsService;

    @Resource
    private PaimaiWebSocket paimaiWebSocket;

    @Resource
    private AppApi appApi;

    @Resource
    MiniappServices miniappServices;

    @Resource
    IPerformanceService performanceService;

    @XxlJob(value = "REFUND_DEPOSIT")
    public ReturnT<String> refundDeposits(String params) {
        log.info("我是定时任务【自动退保证金】，我执行了哦");
        //查找所有应用
        List<AppVO> apps = appApi.allApps();
        apps.forEach(appVO -> {
            log.info("开始处理App {} 的保证金退款", appVO.getId());
            AppContext.setApp(appVO.getId());
            try{
                resolveDeposit(appVO.getId());
            }
            catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
        });
        return ReturnT.SUCCESS;
    }

    @Transactional
    void resolveDeposit(String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        List<GoodsDeposit> goodsDeposits = goodsDepositService.list(queryWrapper);

        for (GoodsDeposit goodsDeposit : goodsDeposits) {
            if (StringUtils.isNotEmpty(goodsDeposit.getGoodsId())) {
                //如果是拍品的
                Goods goods = goodsService.getById(goodsDeposit.getGoodsId());
                if (goods.getState() == 3) {
                    //拍品状态为成交了
                    GoodsOffer maxOfferRow = goodsOfferService.getMaxOfferRow(goods.getId());
                    if (!maxOfferRow.getMemberId().equals(goodsDeposit.getMemberId())) {
                        refund(goodsDeposit.getPrice(), goodsDeposit, appId);
                    }
                    else {
                        //如果成交了，则看看订单有没有支付
                        LambdaQueryWrapper<GoodsOrder> goodsOrderLambdaQueryWrapper = new LambdaQueryWrapper<>();
                        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getGoodsOfferId, maxOfferRow.getId());
                        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getMemberId, maxOfferRow.getMemberId());

                        GoodsOrder goodsOrder = goodsOrderService.getOne(goodsOrderLambdaQueryWrapper);
                        if(goodsOrder != null && goodsOrder.getStatus() > 0) {
                            refund(goodsDeposit.getPrice(), goodsDeposit, appId);
                        }
                    }
                }
                else if(goods.getState() == 4) {
                    //如果是流拍了
                    refund(goodsDeposit.getPrice(), goodsDeposit, appId);
                }
            } else if (StringUtils.isNotEmpty(goodsDeposit.getPerformanceId())) {
                Performance performance = performanceService.getById(goodsDeposit.getPerformanceId());
                if((performance.getType() == 1 && performance.getEndTime().before(new Date())) || performance.getState() == 2) {
                    //专场结束了,得看看这个用户在本场中是否有成交记录，如果有则不退款，如果没有则退款
                    LambdaQueryWrapper<GoodsOffer> goodsOfferLambdaQueryWrapper = new LambdaQueryWrapper<>();
                    goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getPerformanceId, performance.getId());
                    goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getMemberId, goodsDeposit.getMemberId());
                    goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getStatus, 1);

                    List<GoodsOffer> memberPerformanceOffers = goodsOfferService.list(goodsOfferLambdaQueryWrapper);

                    if(memberPerformanceOffers.size() > 0) {
                        GoodsOffer maxOfferRow = memberPerformanceOffers.get(0);
                        //如果用户在本场有中标
                        LambdaQueryWrapper<GoodsOrder> goodsOrderLambdaQueryWrapper = new LambdaQueryWrapper<>();
                        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getGoodsOfferId, maxOfferRow.getId());
                        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getMemberId, maxOfferRow.getMemberId());

                        GoodsOrder goodsOrder = goodsOrderService.getOne(goodsOrderLambdaQueryWrapper);
                        if(goodsOrder != null && goodsOrder.getStatus() > 0) {
                            refund(goodsDeposit.getPrice(), goodsDeposit, appId);
                        }
                    }
                    else {
                        refund(goodsDeposit.getPrice(), goodsDeposit, appId);
                    }
                }
            }
        }

    }

    @Transactional
    void refund(Float amount, GoodsDeposit order, String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        Integer refundAmount = BigDecimal.valueOf(amount).multiply(BigDecimal.valueOf(100)).intValue();
        log.info("原路返回支付保证金 {}", refundAmount);
        WxPayRefundRequest refundRequest = WxPayRefundRequest.newBuilder()
                .transactionId(order.getTransactionId())
                .outRefundNo(order.getId())
                .totalFee(refundAmount)
                .refundFee(refundAmount)
                .build();
        WxPayService wxPayService = miniappServices.getService(appId);
        WxPayRefundResult result = wxPayService.refund(refundRequest);
        if (!"SUCCESS".equals(result.getReturnCode()) || !"SUCCESS".equals(result.getResultCode())) {
            throw new JeecgBootException("退款失败");
        }
        order.setStatus(2);
        goodsDepositService.updateById(order);
    }

    @XxlJob(value = "RUN_AUCTION")
    public ReturnT<String> runningAuction(String params) {
        log.info("我是定时任务【处理拍品】，我执行了哦");
        //查找所有应用
        List<AppVO> apps = appApi.allApps();
        apps.forEach(appVO -> {
            log.info("开始处理App {} 的拍品数据", appVO.getId());
            AppContext.setApp(appVO.getId());
            try{
                resolveGoods();
            }
            catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
        return ReturnT.SUCCESS;
    }

    @Transactional
    void resolveGoods() {
        Date nowDate = new Date();
        //查找限时拍拍品结束了的
        LambdaQueryWrapper<Goods> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Goods::getType, 1);
        queryWrapper.lt(Goods::getState, 2);
        queryWrapper.and(qw -> {
            qw.and(qw1 -> {
                qw1.isNull(Goods::getActualEndTime).lt(Goods::getEndTime, nowDate);
            }).or(qw2 -> {
                qw2.isNotNull(Goods::getActualEndTime).lt(Goods::getActualEndTime, nowDate);
            });
        });
        List<Goods> goodsList = goodsService.list(queryWrapper);

        log.info("有 {} 个拍品待处理", goodsList.size());
        //处理流拍及成交逻辑
        goodsList.forEach(goods -> {
            BigDecimal minPrice = BigDecimal.valueOf(goods.getMinPrice());
            GoodsOffer maxOfferRow = goodsOfferService.getMaxOfferRow(goods.getId());

            GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
            goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_CHANGED);
            goodsUpdateMessage.setEndTime(goods.getEndTime());
            goodsUpdateMessage.setActualEndTime(goods.getActualEndTime());
            goodsUpdateMessage.setGoodsId(goods.getId());
            goodsUpdateMessage.setStartTime(goods.getStartTime());

            if(maxOfferRow == null || BigDecimal.valueOf(maxOfferRow.getPrice()).compareTo(minPrice) < 0) {
                //流拍了,将拍品状态改为流拍，并将拍品所有出价改为流拍
                log.info("拍品 {} 流拍了", goods.getId());
                goods.setState(4);
                LambdaUpdateWrapper<GoodsOffer> updateWrapper = new LambdaUpdateWrapper<>();
                updateWrapper.set(GoodsOffer::getStatus, 2);
                updateWrapper.eq(GoodsOffer::getGoodsId, goods.getId());
                goodsOfferService.update(updateWrapper);

                goodsUpdateMessage.setState(4);
                paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
                goodsService.updateById(goods);
            }
            else {
                log.info("拍品 {} 成交了", goods.getId());
                //成交了,将拍品状态改为成交，并将最大出价改为成交
                goods.setState(3);
                maxOfferRow.setStatus(1);
                goods.setDealPrice(maxOfferRow.getPrice());
                //发送消息
                goodsUpdateMessage.setState(3);
                goodsUpdateMessage.setDealPrice(maxOfferRow.getPrice());
                paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
                goodsService.updateById(goods);


                //生成成交订单
                GoodsOrder goodsOrder = new GoodsOrder();
                goodsOrder.setMemberId(maxOfferRow.getMemberId());
                goodsOrder.setMemberName(maxOfferRow.getMemberName());
                goodsOrder.setMemberAvatar(maxOfferRow.getMemberAvatar());
                goodsOrder.setStatus(0);
                goodsOrder.setPayedPrice(maxOfferRow.getPrice());
                goodsOrder.setTotalPrice(maxOfferRow.getPrice());
                goodsOrder.setGoodsCount(1);
                goodsOrder.setType(1);
                goodsOrder.setGoodsOfferId(maxOfferRow.getId());
                goodsOrder.setPerformanceId(maxOfferRow.getPerformanceId());
                goodsOrderService.save(goodsOrder);

                OrderGoods orderGoods = new OrderGoods();
                orderGoods.setGoodsImage(goods.getImages().split(",")[0]);
                orderGoods.setGoodsName(goods.getTitle());
                orderGoods.setGoodsId(goods.getId());
                orderGoods.setGoodsPrice(maxOfferRow.getPrice());
                orderGoods.setGoodsCount(1);
                orderGoods.setOrderId(goodsOrder.getId());
                orderGoodsService.save(orderGoods);

            }
        });
    }
}
