package cn.winkt.modules.paimai.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.im.ImClientService;
import cn.winkt.modules.paimai.vo.GoodsSettings;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AuctionJobService {
    @Resource
    private IGoodsService goodsService;
    @Resource
    private WxTemplateMessageService wxTemplateMessageService;
    @Resource
    private IGoodsOfferService goodsOfferService;

    @Resource
    private IGoodsDepositService goodsDepositService;

    @Resource
    private IGoodsOrderService goodsOrderService;

    @Resource
    private IOrderGoodsService orderGoodsService;

    @Resource
    private ImClientService imClientService;

    @Resource
    private AppApi appApi;

    @Resource
    MiniappServices miniappServices;

    @Resource
    IPerformanceService performanceService;


    @Resource
    IMessagePoolService messagePoolService;

    @Resource
    IGoodsCommonDescService goodsCommonDescService;


    @Resource
    AuctionHelpService auctionHelpService;

    /**
     * 定时任务提醒
     *
     * @return
     */
    @XxlJob(value = "MESSAGE_NOTIFY")
    public ReturnT<String> messageNotify(String params) {
        log.debug("我是定时任务【消息提醒】，我执行了哦");
        //查找所有应用
        List<AppVO> apps = appApi.allApps();
        apps.forEach(appVO -> {
            log.debug("开始处理App{} 的消息提醒", appVO.getId());
            AppContext.setApp(appVO.getId());
            try {
                WxMaService wxMaService = miniappServices.getWxMaService(appVO.getId());
                //获取即将开始的专场提醒
                Date now = new Date();
                now = DateUtils.addHours(now, Integer.parseInt(params));
                notifyPerformance(now, 1, wxMaService);
                notifyPerformance(now, 2, wxMaService);
                notifyGoods(now, 1, wxMaService);
                notifyGoods(now, 2, wxMaService);
            } catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
        });
        return ReturnT.SUCCESS;
    }

    private void notifyGoods(Date now, Integer type, WxMaService wxMaService) throws WxErrorException {
        LambdaQueryWrapper<MessagePool> messagePoolLambdaQueryWrapper = new LambdaQueryWrapper<>();
        messagePoolLambdaQueryWrapper.eq(MessagePool::getStatus, 0);
        messagePoolLambdaQueryWrapper.eq(MessagePool::getType, type);
        messagePoolLambdaQueryWrapper.le(MessagePool::getSendTime, now);
        messagePoolLambdaQueryWrapper.isNotNull(MessagePool::getGoodsId);

        List<MessagePool> messagePools = messagePoolService.list(messagePoolLambdaQueryWrapper);

        for (MessagePool messagePool : messagePools) {
            //发送模板消息
            Goods g = goodsService.getById(messagePool.getGoodsId());
            if (g == null) continue;
            Performance performance = performanceService.getById(g.getPerformanceId());
            WxMaSubscribeMessage m = new WxMaSubscribeMessage();
            m.setTemplateId(messagePool.getTemplateId());
            m.setPage("/pages/goods/detail?id=" + g.getId());
            m.setMiniprogramState("formal");
            m.setLang("zh_CN");
            m.setToUser(messagePool.getMemberOpenId());
            List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();
            if (type == 1) {
                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("thing4");
                data1.setValue(performance == null ? g.getTitle() : performance.getTitle());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing1");
                data2.setValue(g.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("date2");
                data3.setValue(DateFormatUtils.format(g.getStartTime(), "yyyy-MM-dd HH:mm:ss"));
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data4.setName("thing5");
                data4.setValue(messagePool.getMessage());
                data.add(data4);
            } else if (type == 2) {
                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("thing5");
                data1.setValue(performance == null ? g.getTitle() : performance.getTitle());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing1");
                data2.setValue(g.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("time7");
                Date endTime = g.getActualEndTime() == null ? g.getEndTime() : g.getActualEndTime();
                data3.setValue(DateFormatUtils.format(endTime, "yyyy-MM-dd HH:mm:ss"));
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data4.setName("thing8");
                data4.setValue(messagePool.getMessage());
                data.add(data4);
            }
            m.setData(data);
            try {
                wxMaService.getMsgService().sendSubscribeMsg(m);
            } catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
            messagePool.setStatus(1);
            messagePool.setSendTime(new Date());
            messagePoolService.updateById(messagePool);
        }
    }

    private void notifyPerformance(Date now, Integer type, WxMaService wxMaService) throws WxErrorException {
        //提醒用户啊
        LambdaQueryWrapper<MessagePool> messagePoolLambdaQueryWrapper = new LambdaQueryWrapper<>();
        messagePoolLambdaQueryWrapper.eq(MessagePool::getStatus, 0);
        messagePoolLambdaQueryWrapper.eq(MessagePool::getType, type);
        messagePoolLambdaQueryWrapper.le(MessagePool::getSendTime, now);
        messagePoolLambdaQueryWrapper.isNotNull(MessagePool::getPerformanceId);
        List<MessagePool> messagePools = messagePoolService.list(messagePoolLambdaQueryWrapper);

        for (MessagePool messagePool : messagePools) {
            Performance p = performanceService.getById(messagePool.getPerformanceId());
            if (p == null) continue;
            //发送模板消息
            WxMaSubscribeMessage m = new WxMaSubscribeMessage();
            m.setTemplateId(messagePool.getTemplateId());
            m.setPage("/pages/performance/detail?id=" + p.getId());
            m.setMiniprogramState("formal");
            m.setLang("zh_CN");
            m.setToUser(messagePool.getMemberOpenId());
            List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();
            if (type == 1) {
                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("thing4");
                data1.setValue(p.getTitle());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing1");
                data2.setValue(p.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("date2");
                data3.setValue(DateFormatUtils.format(p.getStartTime(), "yyyy-MM-dd HH:mm:ss"));
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data4.setName("thing5");
                data4.setValue(messagePool.getMessage());
                data.add(data4);
            } else if (type == 2) {
                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("thing5");
                data1.setValue(p.getTitle());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing1");
                data2.setValue(p.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("time7");
                data3.setValue(DateFormatUtils.format(p.getEndTime(), "yyyy-MM-dd HH:mm:ss"));
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data4.setName("thing8");
                data4.setValue(messagePool.getMessage());
                data.add(data4);
            }
            m.setData(data);
            try {
                wxMaService.getMsgService().sendSubscribeMsg(m);
            } catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
            messagePool.setStatus(1);
            messagePool.setSendTime(new Date());
            messagePoolService.updateById(messagePool);
        }
    }

    /**
     * 定时任务退还保证金
     *
     * @param params
     * @return
     */
    @XxlJob(value = "REFUND_DEPOSIT")
    public ReturnT<String> refundDeposits(String params) {
        log.debug("我是定时任务【自动退保证金】，我执行了哦");
        //查找所有应用
        List<AppVO> apps = appApi.allApps();
        apps.forEach(appVO -> {
            log.debug("开始处理App {} 的保证金退款", appVO.getId());
            AppContext.setApp(appVO.getId());
            try {
                auctionHelpService.refundDeposit(appVO.getId(), params);
            } catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
        });
        return ReturnT.SUCCESS;
    }


    /**
     * 定时任务处理拍卖流程
     *
     * @param params
     * @return
     */
    @XxlJob(value = "RUN_AUCTION")
    public ReturnT<String> runningAuction(String params) {
        log.debug("我是定时任务【处理拍品】，我执行了哦");
        //查找所有应用
        List<AppVO> apps = appApi.allApps();
        apps.forEach(appVO -> {
            log.debug("开始处理App {} 的拍品数据", appVO.getId());
            AppContext.setApp(appVO.getId());
            try {
                auctionHelpService.resolveGoods();
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
        return ReturnT.SUCCESS;
    }


    /**
     * 自动取消订单
     */
    @XxlJob(value = "GOODS_ORDER_CANCEL")
    public ReturnT<String> autoCancelGoodsOrders(String params) {
        log.debug("开始处理过期未支付的订单");
        int cancelTimeout = 15;
        int noticeTimeout = 5;

        if(StringUtils.isNotEmpty(params)) {
            String[] paramsArr = params.split(",");
            cancelTimeout = Integer.parseInt(paramsArr[0]);
            noticeTimeout = Integer.parseInt(paramsArr[1]);
        }
        List<AppVO> apps = appApi.allApps();
        for (AppVO appVO : apps) {
            log.debug("处理应用{}未处理订单", appVO.getId());
            AppContext.setApp(appVO.getId());
            //获取超过5分钟未支付的微信支付订单，自动处理并取消订单
            QueryWrapper<GoodsOrder> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("status", 0);
            queryWrapper.eq("type", 2);
            queryWrapper.eq("pay_type", 1);
            queryWrapper.lt("create_time", DateUtils.addMinutes(new Date(), -cancelTimeout));
            List<GoodsOrder> goodsOrders = goodsOrderService.list(queryWrapper);
            goodsOrders.forEach(goodsOrder -> {
                try {
                    goodsOrderService.cancel(goodsOrder);
                } catch (Exception exception) {
                    log.error(exception.getMessage(), exception);
                }
            });

            //获取超过2分钟未支付的订单，批量发送模板消息提醒用户去支付
            GoodsSettings goodsSettings = goodsCommonDescService.queryGoodsSettings();
            final String templateId = goodsSettings.getOrderNotPayTemplateId();
            String templateParams = goodsSettings.getOrderNotPayTemplateArgs();
            if (!StringUtils.isAnyEmpty(templateParams, templateId)) {
                LambdaQueryWrapper<GoodsOrder> goodsOrderLambdaQueryWrapper = new LambdaQueryWrapper<>();
                goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getStatus, 0);
                goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getPayNotified, 0);
                goodsOrderLambdaQueryWrapper.lt(GoodsOrder::getCreateTime, DateUtils.addMinutes(new Date(), -noticeTimeout));
                List<GoodsOrder> notPayOrders = goodsOrderService.list(goodsOrderLambdaQueryWrapper);
                for (GoodsOrder goodsOrder : notPayOrders) {
                    LambdaQueryWrapper<OrderGoods> orderGoodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
                    orderGoodsLambdaQueryWrapper.eq(OrderGoods::getOrderId, goodsOrder.getId());
                    List<OrderGoods> orderGoods = orderGoodsService.list(orderGoodsLambdaQueryWrapper);
                    templateParams = templateParams.replace("{orderId}", goodsOrder.getId());
                    templateParams = templateParams.replace("{createTime}", DateFormatUtils.format(goodsOrder.getCreateTime(), "yyyy-MM-dd HH:mm:ss"));
                    templateParams = templateParams.replace("{endPayTime}", DateFormatUtils.format(DateUtils.addMinutes(goodsOrder.getCreateTime(), 5), "yyyy-MM-dd HH:mm:ss"));
                    templateParams = templateParams.replace("{goodsNames}", orderGoods.stream().map(OrderGoods::getGoodsName).collect(Collectors.joining()));
                    templateParams = templateParams.replace("{totalPay}", BigDecimal.valueOf(goodsOrder.getPayedPrice()).setScale(2, RoundingMode.CEILING).toString());
                    try {
                        wxTemplateMessageService.sendTemplateMessage(templateId, templateParams, "/order/pages/orders/detail?id=" + goodsOrder.getId(), goodsOrder.getMemberId(), AppContext.getApp());
                        goodsOrder.setPayNotified(1);
                        goodsOrderService.updateById(goodsOrder);
                    } catch (Exception e) {
                        log.error(e.getMessage(), e);
                    }
                }
            }
        }
        return ReturnT.SUCCESS;
    }

}
