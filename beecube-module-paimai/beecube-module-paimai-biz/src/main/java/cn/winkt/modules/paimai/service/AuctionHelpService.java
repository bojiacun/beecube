package cn.winkt.modules.paimai.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.im.ImClientService;
import cn.winkt.modules.paimai.service.im.UserMessageType;
import cn.winkt.modules.paimai.service.im.message.GoodsUpdateMessage;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.common.util.SpringContextUtils;
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
public class AuctionHelpService {

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
    ImClientService imClientService;

    @Resource
    IGoodsCommonDescService goodsCommonDescService;
    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    AppApi appApi;

    @Transactional(rollbackFor = Exception.class)
    public void refundDeposit(String appId, String delay) throws InvocationTargetException, IllegalAccessException, WxPayException {
        Date distDate = DateUtils.addHours(new Date(), -Integer.parseInt(delay));
        //获取所有过期的专场
        LambdaQueryWrapper<Performance> performanceLambdaQueryWrapper = new LambdaQueryWrapper<>();
        performanceLambdaQueryWrapper.lt(Performance::getEndTime, distDate);
        List<Performance> performances = performanceService.list(performanceLambdaQueryWrapper);
        for (Performance performance : performances) {
            //获取专场所有的保证金记录
            LambdaQueryWrapper<GoodsDeposit> goodsDepositLambdaQueryWrapper = new LambdaQueryWrapper<>();
            goodsDepositLambdaQueryWrapper.eq(GoodsDeposit::getPerformanceId, performance.getId());
            goodsDepositLambdaQueryWrapper.eq(GoodsDeposit::getStatus, 1);

            List<GoodsDeposit> performanceDeposits = goodsDepositService.list(goodsDepositLambdaQueryWrapper);
            //查看当前交保证金的人有没有中标
            for (GoodsDeposit deposit : performanceDeposits) {
                String memberId = deposit.getMemberId();
                //该用户在本专场没有中标一个拍品，则自动退款保证金
                LambdaQueryWrapper<GoodsOffer> goodsOfferLambdaQueryWrapper = new LambdaQueryWrapper<>();
                goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getMemberId, memberId);
                goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getPerformanceId, performance.getId());
                goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getStatus, 1);

                if(goodsOfferService.count(goodsOfferLambdaQueryWrapper) == 0) {
                    refund(deposit, appId);
                }
            }
        }

        //获取所有过期的独立拍品
        LambdaQueryWrapper<Goods> goodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
        goodsLambdaQueryWrapper.isNull(Goods::getPerformanceId);
        goodsLambdaQueryWrapper.and(qw -> {
            qw.isNull(Goods::getActualEndTime).lt(Goods::getEndTime, distDate);
            qw.or(qw2 -> {
                qw2.isNotNull(Goods::getActualEndTime).lt(Goods::getActualEndTime, distDate);
            });
        });

        List<Goods> goodsList = goodsService.list(goodsLambdaQueryWrapper);
        for (Goods g : goodsList) {
            //获取拍品所有的保证金记录
            LambdaQueryWrapper<GoodsDeposit> goodsDepositLambdaQueryWrapper = new LambdaQueryWrapper<>();
            goodsDepositLambdaQueryWrapper.eq(GoodsDeposit::getGoodsId, g.getId());
            goodsDepositLambdaQueryWrapper.eq(GoodsDeposit::getStatus, 1);

            List<GoodsDeposit> deposits = goodsDepositService.list(goodsDepositLambdaQueryWrapper);
            for (GoodsDeposit deposit : deposits) {
                //当前交保证金的人有没有中标该拍品
                LambdaQueryWrapper<GoodsOffer> goodsOfferLambdaQueryWrapper = new LambdaQueryWrapper<>();
                goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getMemberId, deposit.getMemberId());
                goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getGoodsId, g.getId());
                goodsOfferLambdaQueryWrapper.eq(GoodsOffer::getStatus, 1);

                if(goodsOfferService.count(goodsOfferLambdaQueryWrapper) == 0) {
                    refund(deposit, appId);
                }

            }
        }

    }

    @Transactional(rollbackFor = Exception.class)
    public void refund(GoodsDeposit order, String appId) throws InvocationTargetException, IllegalAccessException, WxPayException {
        Integer refundAmount = BigDecimal.valueOf(order.getPrice()).multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.CEILING).intValue();
        log.debug("原路返回支付保证金 {}", refundAmount);
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

        log.debug("有 {} 个拍品待处理", goodsList.size());
        String token = getTempToken();
        //处理流拍及成交逻辑
        goodsList.forEach(goods -> {
            BigDecimal minPrice = BigDecimal.valueOf(goods.getMinPrice());
            GoodsOffer maxOfferRow = goodsOfferService.getMaxOfferRow(goods.getId());

            GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
            goodsUpdateMessage.setEndTime(goods.getEndTime());
            goodsUpdateMessage.setActualEndTime(goods.getActualEndTime());
            goodsUpdateMessage.setGoodsId(goods.getId());
            goodsUpdateMessage.setStartTime(goods.getStartTime());

            if(maxOfferRow == null || maxOfferRow.getPrice().compareTo(minPrice) < 0) {
                //流拍了,将拍品状态改为流拍，并将拍品所有出价改为流拍
                log.debug("拍品 {} 流拍了", goods.getId());
                goods.setState(4);
                LambdaUpdateWrapper<GoodsOffer> updateWrapper = new LambdaUpdateWrapper<>();
                updateWrapper.set(GoodsOffer::getStatus, 2);
                updateWrapper.eq(GoodsOffer::getGoodsId, goods.getId());
                goodsOfferService.update(updateWrapper);

                goodsUpdateMessage.setState(4);
                imClientService.sendAppMessage(goodsUpdateMessage, UserMessageType.GOODS_UPDATE);
                goodsService.updateById(goods);
            }
            else {
                log.debug("拍品 {} 成交了", goods.getId());
                //成交了,将拍品状态改为成交，并将最大出价改为成交
                goods.setState(3);
                maxOfferRow.setStatus(1);
                goodsOfferService.updateById(maxOfferRow);
                goods.setDealPrice(maxOfferRow.getPrice());
                //发送消息
                goodsUpdateMessage.setState(3);
                goodsUpdateMessage.setDealUserId(maxOfferRow.getMemberId());
                goodsUpdateMessage.setDealPrice(maxOfferRow.getPrice());
                imClientService.sendAppMessage(goodsUpdateMessage, UserMessageType.GOODS_UPDATE);
                goodsService.updateById(goods);

                //计算成交佣金
                BigDecimal commission = BigDecimal.ZERO;
                if(goods.getCommission() != null) {
                    commission = BigDecimal.valueOf(goods.getCommission()).divide(BigDecimal.valueOf(100), 4, RoundingMode.CEILING);
                }

                BigDecimal price = maxOfferRow.getPrice();
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
        log.debug("发送模板消息 {}", appId);
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
                data3.setValue(goodsOffer.getPrice().setScale(2, RoundingMode.CEILING).toString());
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
    private String getTempToken() {
        RedisUtil redisUtil = SpringContextUtils.getBean(RedisUtil.class);
        //模拟登录生成临时Token
        //参数说明：第一个参数是用户名、第二个参数是密码的加密串
        String token = JwtUtil.sign("admin","cb362cfeefbf3d8d");
        // 设置Token缓存有效时间为 5 分钟
        redisUtil.set(CommonConstant.PREFIX_USER_TOKEN + token, token);
        redisUtil.expire(CommonConstant.PREFIX_USER_TOKEN + token, 5 * 60 * 1000);
        return token;
    }
}
