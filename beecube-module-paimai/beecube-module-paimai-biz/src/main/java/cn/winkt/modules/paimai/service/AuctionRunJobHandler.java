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
    void resolveDeposit(String appId) throws InvocationTargetException, IllegalAccessException {
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        List<GoodsDeposit> goodsDeposits = goodsDepositService.list(queryWrapper);

        goodsDeposits.forEach(goodsDeposit -> {
            if(StringUtils.isNotEmpty(goodsDeposit.getGoodsId())) {
                //如果是拍品的
                Goods goods = goodsService.getById(goodsDeposit.getGoodsId());
                if(goods.getState() > 1) {
                    GoodsOffer dealOffer = goodsOfferService.getMaxOfferRow(goodsDeposit.getGoodsId());
                    if(dealOffer == null || !dealOffer.getMemberId().equals(goodsDeposit.getMemberId())) {

                    }
                }
            }
            else if(StringUtils.isNotEmpty(goodsDeposit.getPerformanceId())) {

            }
        });


    }

    private void refund(Float amount, GoodsDeposit order, String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
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
