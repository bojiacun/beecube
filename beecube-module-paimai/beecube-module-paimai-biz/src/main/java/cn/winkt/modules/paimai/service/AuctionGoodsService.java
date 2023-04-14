package cn.winkt.modules.paimai.service;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsOffer;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.im.message.AuctionDelayedMessage;
import cn.winkt.modules.paimai.service.im.message.PerformanceUpdateMessage;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.desensitization.util.SensitiveInfoUtil;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

@org.springframework.stereotype.Service
@Slf4j
public class AuctionGoodsService {

    @Resource
    AppApi appApi;

    @Resource
    IGoodsService goodsService;

    @Resource
    IPerformanceService performanceService;

    @Resource
    RedissonLockClient redissonLockClient;

    @Resource
    IGoodsOfferService goodsOfferService;

    @Resource
    IGoodsDepositService goodsDepositService;



    @Transactional(rollbackFor = Exception.class)
    public Result<?> offer(JSONObject post) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        Goods goods = goodsService.getById(post.getString("id"));
        if (goods == null) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        Date nowDate = new Date();
        Date actualEndTime = goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime();
        Performance performance = null;
        String auctionId = null;
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            performance = performanceService.getById(goods.getPerformanceId());
        }

        if (performance != null) {
            auctionId = performance.getAuctionId();
            if (performance.getType() == 1) {
                if (nowDate.compareTo(performance.getEndTime()) > 0 && goods.getActualEndTime() == null) {
                    throw new JeecgBootException("拍品所在专场已结束");
                }
                if(goods.getState() > 1) {
                    throw new JeecgBootException("该拍品已结束拍卖");
                }
                if (nowDate.compareTo(performance.getStartTime()) < 0) {
                    throw new JeecgBootException("拍品所在专场未开始");
                }
            } else if (performance.getType() == 2) {
                if (performance.getState() == 0) {
                    throw new JeecgBootException("拍品所在专场未开始");
                } else if (performance.getState() == 2) {
                    throw new JeecgBootException("拍品所在专场已结束");
                }
                if (goods.getState() == 0) {
                    throw new JeecgBootException("该拍品尚未开始");
                } else if (goods.getState() == 2) {
                    throw new JeecgBootException("该拍品已结束拍卖");
                }
            }
        } else if (nowDate.compareTo(actualEndTime) >= 0 || goods.getState() > 1) {
            throw new JeecgBootException("该拍品已结束拍卖");
        } else if (nowDate.compareTo(goods.getStartTime()) < 0) {
            throw new JeecgBootException("该拍品尚未开始");
        }

        String lockKey = "OFFER-LOCKER-" + goods.getId();
        if (redissonLockClient.tryLock(lockKey, -1, 300)) {
            BigDecimal userOfferPrice = BigDecimal.valueOf(post.getFloatValue("price"));
            if (userOfferPrice.compareTo(BigDecimal.valueOf(goods.getStartPrice())) < 0) {
                redissonLockClient.unlock(lockKey);
                return Result.error("出价不得低于起拍价");
            }
            Float max = goodsOfferService.getMaxOffer(goods.getId());
            if (max != null && userOfferPrice.compareTo(BigDecimal.valueOf(max)) <= 0) {
                redissonLockClient.unlock(lockKey);
                return Result.error("他人已出此价格或更高的价格");
            }
            //查询用户是否缴纳保证金,如果拍品上了某个专场则以专场保证金为主

            GoodsOffer goodsOffer = new GoodsOffer();
            goodsOffer.setGoodsId(goods.getId());
            goodsOffer.setPerformanceId(goods.getPerformanceId());
            goodsOffer.setAuctionId(auctionId);
            goodsOffer.setPrice(userOfferPrice.floatValue());
            goodsOffer.setMemberId(loginUser.getId());
            goodsOffer.setMemberAvatar(loginUser.getAvatar());
            goodsOffer.setMemberName(StringUtils.getIfEmpty(loginUser.getRealname(), loginUser::getNickname));
            goodsOffer.setMemberPhone(loginUser.getPhone());
            goodsOffer.setOfferTime(new Date());
            goodsOfferService.save(goodsOffer);

            //判断是不是进入到了延时周期如果是，则进行延时，延时逻辑设置到实际结束时间中去
            //并发送延时消息
            if (actualEndTime != null) {
                long nowTimeMillis = System.currentTimeMillis();
                long endTimeMillis = actualEndTime.getTime();
                Integer delayTime = goods.getDelayTime();
                if (delayTime != null && delayTime > 0) {
                    if ((nowTimeMillis + delayTime * 60 * 1000) >= endTimeMillis) {
                        Date newTime = DateUtils.addMinutes(actualEndTime, delayTime);
                        AuctionDelayedMessage message = new AuctionDelayedMessage();
                        message.setGoodsId(goods.getId());
                        message.setNewTime(newTime);
                        if(performance != null) {
                            performance.setEndTime(newTime);
                            performanceService.updateById(performance);
                            //发送专场时间修改通知
                            PerformanceUpdateMessage performanceUpdateMessage = new PerformanceUpdateMessage();
                            performanceUpdateMessage.setStartTime(performance.getStartTime());
                            performanceUpdateMessage.setEndTime(performance.getEndTime());
                            performanceUpdateMessage.setPerformanceId(performance.getId());
                            goodsOfferWebSocket.sendAllMessage(JSONObject.toJSONString(performanceUpdateMessage));
                        }
                        goodsOfferWebSocket.sendAllMessage(JSONObject.toJSONString(message));
                        goods.setActualEndTime(newTime);
                        goodsService.updateById(goods);
                    }
                }
            }
            try {
                //发送出价群消息
                OfferMessage offerMessage = new OfferMessage();
                offerMessage.setGoodsId(goods.getId());
                offerMessage.setFromUserAvatar(loginUser.getAvatar());
                offerMessage.setFromUserId(loginUser.getId());
                offerMessage.setFromUserName(goodsOffer.getMemberName());
                offerMessage.setCreateTime(new Date());
                offerMessage.setType(MessageConstant.MSG_TYPE_OFFER);
                offerMessage.setPrice(BigDecimal.valueOf(goodsOffer.getPrice()).setScale(2, RoundingMode.HALF_DOWN));
                SensitiveInfoUtil.handlerObject(offerMessage, true);
                goodsOfferWebSocket.sendAllMessage(JSONObject.toJSONString(offerMessage));
            } catch (Exception ex) {
                log.error(ex.getMessage(), ex);
            }
            //在此通知群消息
            redissonLockClient.unlock(lockKey);
            return Result.OK("出价成功");
        } else {
            return Result.error("出价失败");
        }
    }
}
