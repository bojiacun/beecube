package cn.winkt.modules.paimai.service;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.im.ImClientService;
import cn.winkt.modules.paimai.service.im.UserMessageType;
import cn.winkt.modules.paimai.service.im.message.AuctionDelayedMessage;
import cn.winkt.modules.paimai.service.im.message.PerformanceUpdateMessage;
import cn.winkt.modules.paimai.service.im.message.UserOfferMessage;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
import org.springframework.web.servlet.support.RequestContextUtils;

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

    @Resource
    ImClientService imClientService;

    @Resource
    ILiveRoomService liveRoomService;



    @Transactional(rollbackFor = Exception.class)
    public Result<?> offer(JSONObject post) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        //用户实名检测，必须绑定手机号才可出价
        AppMemberVO memberVO = appApi.getMemberById(loginUser.getId());
        if(StringUtils.isAnyEmpty(memberVO.getNickname(), memberVO.getPhone(), memberVO.getAvatar())) {
            throw new JeecgBootException("请完善您的用户信息后再出价");
        }
        Goods goods = goodsService.getById(post.getString("id"));
        if (goods == null) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        Performance performance = null;
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            performance = performanceService.getById(goods.getPerformanceId());
        }
        LiveRoom liveRoom = null;
        if(StringUtils.isNotEmpty(goods.getRoomId())) {
            liveRoom = liveRoomService.getById(goods.getRoomId());
        }
        if (performance != null && performance.getDeposit() != null && performance.getDeposit() > 0) {
            LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsDeposit::getPerformanceId, performance.getId());
            queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
            queryWrapper.eq(GoodsDeposit::getStatus, 1);
            if (goodsDepositService.count(queryWrapper) == 0) {
                return Result.error("未缴纳专场保证金");
            }
        }
        else if(liveRoom != null && liveRoom.getDeposit() != null && liveRoom.getDeposit() > 0) {
            LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsDeposit::getRoomId, liveRoom.getId());
            queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
            queryWrapper.eq(GoodsDeposit::getStatus, 1);
            if (goodsDepositService.count(queryWrapper) == 0) {
                return Result.error("未缴纳专场保证金");
            }
        }
        else if (goods.getDeposit() != null && goods.getDeposit() > 0) {
            LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsDeposit::getGoodsId, goods.getId());
            queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
            queryWrapper.eq(GoodsDeposit::getStatus, 1);
            if (goodsDepositService.count(queryWrapper) == 0) {
                return Result.error("未缴纳保证金");
            }
        }

        Date nowDate = new Date();
        Date actualEndTime = goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime();
        String auctionId = null;

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
        }
        else if(liveRoom != null) {
            if (goods.getState() == 0) {
                throw new JeecgBootException("该拍品尚未开始");
            } else if (goods.getState() == 2) {
                throw new JeecgBootException("该拍品已结束拍卖");
            }
        }
        else if (nowDate.compareTo(actualEndTime) >= 0 || goods.getState() > 1) {
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
            goodsOffer.setRoomId(goods.getRoomId());
            goodsOffer.setAuctionId(auctionId);
            goodsOffer.setPrice(userOfferPrice.floatValue());
            goodsOffer.setMemberId(memberVO.getId());
            goodsOffer.setMemberAvatar(memberVO.getAvatar());
            goodsOffer.setMemberName(StringUtils.getIfEmpty(memberVO.getRealname(), memberVO::getNickname));
            goodsOffer.setMemberPhone(memberVO.getPhone());
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
                            imClientService.sendAppMessage(performanceUpdateMessage, UserMessageType.PERFORMANCE_UPDATE);
                        }
                        imClientService.sendAppMessage(message, UserMessageType.AUCTION_DELAYED);
                        goods.setActualEndTime(newTime);
                        goodsService.updateById(goods);
                    }
                }
            }
            try {
                //发送出价群消息
                UserOfferMessage offerMessage = new UserOfferMessage();
                offerMessage.setGoodsId(goods.getId());
                offerMessage.setUserAvatar(memberVO.getAvatar());
                offerMessage.setUserId(memberVO.getId());
                offerMessage.setUserName(goodsOffer.getMemberName());
                offerMessage.setPrice(BigDecimal.valueOf(goodsOffer.getPrice()).setScale(2, RoundingMode.HALF_DOWN));
                offerMessage.setOfferTime(new Date());
                SensitiveInfoUtil.handlerObject(offerMessage, true);
                imClientService.sendAppMessage(offerMessage, UserMessageType.OFFER);
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
