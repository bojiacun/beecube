package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsOffer;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.message.GoodsUpdateMessage;
import cn.winkt.modules.paimai.message.MessageConstant;
import cn.winkt.modules.paimai.message.OfferMessage;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
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

    @XxlJob(value = "RUN_AUCTION")
    @Transactional
    public ReturnT<String> runningAuction(String params) {
        log.info("我是定时任务，我执行了哦, APPID {}", params);
        AppContext.setApp(params);
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



        return ReturnT.SUCCESS;
    }
}
