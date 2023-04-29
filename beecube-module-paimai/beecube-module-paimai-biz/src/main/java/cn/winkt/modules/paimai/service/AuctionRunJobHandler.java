package cn.winkt.modules.paimai.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.im.ImClientService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

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
    JobService jobService;
    /**
     * 定时任务提醒
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
            try{
                WxMaService wxMaService = miniappServices.getWxMaService(appVO.getId());
                //获取即将开始的专场提醒
                Date now = new Date();
                now = DateUtils.addHours(now, Integer.parseInt(params));
                notifyPerformance(now, 1, wxMaService);
                notifyPerformance(now, 2, wxMaService);
                notifyGoods(now ,1, wxMaService);
                notifyGoods(now, 2, wxMaService);
            }
            catch (Exception exception) {
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
            if(g == null) continue;
            Performance performance = performanceService.getById(g.getPerformanceId());
            WxMaSubscribeMessage m = new WxMaSubscribeMessage();
            m.setTemplateId(messagePool.getTemplateId());
            m.setPage("/pages/goods/detail?id="+g.getId());
            m.setMiniprogramState("formal");
            m.setLang("zh_CN");
            m.setToUser(messagePool.getMemberOpenId());
            List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();
            if(type == 1) {
                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("thing4");
                data1.setValue(performance == null ? g.getTitle():performance.getTitle());
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
            }
            else if(type == 2) {
                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("thing5");
                data1.setValue(performance == null ? g.getTitle():performance.getTitle());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing1");
                data2.setValue(g.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("time7");
                Date endTime = g.getActualEndTime() == null ? g.getEndTime():g.getActualEndTime();
                data3.setValue(DateFormatUtils.format(endTime, "yyyy-MM-dd HH:mm:ss"));
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data4.setName("thing8");
                data4.setValue(messagePool.getMessage());
                data.add(data4);
            }
            m.setData(data);
            try{
                wxMaService.getMsgService().sendSubscribeMsg(m);
            }
            catch (Exception exception) {
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
            if(p == null) continue;
            //发送模板消息
            WxMaSubscribeMessage m = new WxMaSubscribeMessage();
            m.setTemplateId(messagePool.getTemplateId());
            m.setPage("/pages/performance/detail?id="+p.getId());
            m.setMiniprogramState("formal");
            m.setLang("zh_CN");
            m.setToUser(messagePool.getMemberOpenId());
            List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();
            if(type == 1) {
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
            }
            else if(type == 2) {
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
            try{
                wxMaService.getMsgService().sendSubscribeMsg(m);
            }
            catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
            messagePool.setStatus(1);
            messagePool.setSendTime(new Date());
            messagePoolService.updateById(messagePool);
        }
    }

    /**
     * 定时任务退还保证金
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
            try{
                jobService.refundDeposit(appVO.getId(), params);
            }
            catch (Exception exception) {
                log.error(exception.getMessage(), exception);
            }
        });
        return ReturnT.SUCCESS;
    }





    @XxlJob(value = "RUN_AUCTION")
    public ReturnT<String> runningAuction(String params) {
        log.debug("我是定时任务【处理拍品】，我执行了哦");
        //查找所有应用
        List<AppVO> apps = appApi.allApps();
        apps.forEach(appVO -> {
            log.debug("开始处理App {} 的拍品数据", appVO.getId());
            AppContext.setApp(appVO.getId());
            try{
                jobService.resolveGoods();
            }
            catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        });
        return ReturnT.SUCCESS;
    }




}
