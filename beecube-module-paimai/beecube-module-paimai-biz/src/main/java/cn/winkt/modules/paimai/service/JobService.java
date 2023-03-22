package cn.winkt.modules.paimai.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.message.GoodsUpdateMessage;
import cn.winkt.modules.paimai.message.MessageConstant;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.config.AppContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@Slf4j
public class JobService {

    @Resource
    private IGoodsDepositService goodsDepositService;

    @Resource
    IGoodsService goodsService;

    @Resource
    IGoodsOrderService goodsOrderService;
    @Resource
    IGoodsOfferService goodsOfferService;

    @Resource
    IPerformanceService performanceService;

    @Resource
    MiniappServices miniappServices;

    @Resource
    PaimaiWebSocket paimaiWebSocket;

    @Resource
    IGoodsCommonDescService goodsCommonDescService;
    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    AppApi appApi;

    @Transactional(rollbackFor = Exception.class)
    public void refundDeposit(String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
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

    @Transactional(rollbackFor = Exception.class)
    public void refund(Float amount, GoodsDeposit order, String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
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


    @Transactional(rollbackFor = Exception.class)
    public void resolveGoods() {
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
                goodsOfferService.updateById(maxOfferRow);
                goods.setDealPrice(maxOfferRow.getPrice());
                //发送消息
                goodsUpdateMessage.setState(3);
                goodsUpdateMessage.setDealUserId(maxOfferRow.getMemberId());
                goodsUpdateMessage.setDealPrice(maxOfferRow.getPrice());
                paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
                goodsService.updateById(goods);

                //计算成交佣金
                BigDecimal commission = BigDecimal.ZERO;
                if(goods.getCommission() != null) {
                    commission = BigDecimal.valueOf(goods.getCommission()).divide(BigDecimal.valueOf(100), 4, RoundingMode.CEILING);
                }

                BigDecimal price = BigDecimal.valueOf(maxOfferRow.getPrice());
                BigDecimal newPrice = price.multiply(commission).add(price).setScale(2, RoundingMode.CEILING);
                //生成成交订单
                GoodsOrder goodsOrder = new GoodsOrder();
                goodsOrder.setMemberId(maxOfferRow.getMemberId());
                goodsOrder.setMemberName(maxOfferRow.getMemberName());
                goodsOrder.setMemberAvatar(maxOfferRow.getMemberAvatar());
                goodsOrder.setStatus(0);
                goodsOrder.setPayedPrice(newPrice.floatValue());
                goodsOrder.setTotalPrice(newPrice.floatValue());
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

            //发送消息
            try{
                this.sendOfferResultMessage(goods, AppContext.getApp());
            }
            catch (Exception e) {
                log.error(e.getMessage(), e);
            }

        });
    }

    @Async
    void sendOfferResultMessage(Goods goods, String appId) throws InvocationTargetException, IllegalAccessException, WxErrorException {
        AppContext.setApp(appId);
        log.info("发送模板消息 {}", appId);
        LambdaQueryWrapper<GoodsOffer> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOffer::getGoodsId, goods.getId());
        queryWrapper.orderByDesc(GoodsOffer::getPrice);

        List<GoodsOffer> goodsOffers = goodsOfferService.list(queryWrapper);
        WxMaService wxMaService = miniappServices.getWxMaService(AppContext.getApp());
        List<GoodsCommonDesc> paimaiSettings = goodsCommonDescService.list();
        String templateId = null;
        for (GoodsCommonDesc s : paimaiSettings) {
            if (s.getDescKey().equals("offerResultTemplateId")) {
                templateId = s.getDescValue();
            }
        }

        if(templateId != null) {
            //发送缓存，已经发送的用户，跳过不再发送
            Set<String> sended = new HashSet<>();

            for (GoodsOffer goodsOffer : goodsOffers) {
                AppMemberVO appMemberVO = appApi.getMemberById(goodsOffer.getMemberId());
                if(sended.contains(appMemberVO.getId())) {
                    continue;
                }
                sended.add(appMemberVO.getId());
                WxMaSubscribeMessage m = new WxMaSubscribeMessage();
                m.setTemplateId(templateId);
                m.setMiniprogramState("formal");
                m.setPage("/pages/goods/detail?id="+goodsOffer.getGoodsId());
                m.setToUser(appMemberVO.getWxappOpenid());
                List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();

                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("character_string1");
                data1.setValue(goods.getId());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing6");
                data2.setValue(goods.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("amount4");
                data3.setValue(BigDecimal.valueOf(goodsOffer.getPrice()).setScale(2, RoundingMode.CEILING).toString());
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data4.setName("phrase5");
                data4.setValue(goodsOffer.getStatus() == 1 ? "中标":"未中标");
                data.add(data4);
                m.setData(data);
                wxMaService.getMsgService().sendSubscribeMsg(m);

            }
        }
    }
}
