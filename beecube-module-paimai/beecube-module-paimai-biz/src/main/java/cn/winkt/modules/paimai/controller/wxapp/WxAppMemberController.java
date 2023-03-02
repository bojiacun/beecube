package cn.winkt.modules.paimai.controller.wxapp;


import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.binarywang.wxpay.bean.notify.WxPayNotifyResponse;
import com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult;
import com.github.binarywang.wxpay.bean.order.WxPayMpOrderResult;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

@RequestMapping("/paimai/api/members")
@RestController
public class WxAppMemberController {

    @Resource
    IGoodsService goodsService;
    @Resource
    IGoodsFollowService goodsFollowService;
    @Resource
    IGoodsViewService goodsViewService;

    @Resource
    AppApi appApi;
    @Resource
    IPayLogService payLogService;
    @Resource
    IGoodsDepositService goodsDepositService;
    @Resource
    IPerformanceService performanceService;

    @Resource
    JeecgBaseConfig jeecgBaseConfig;

    @Resource
    MiniappServices miniappServices;

    @Resource
    RedissonLockClient redissonLockClient;

    @Resource
    IGoodsOfferService goodsOfferService;



    /**
     * 获取用户的浏览记录
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping("/views")
    public Result<?> queryMemberViewGoods(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberViewGoods(loginUser.getId(), page);
        return Result.OK(pageList);
    }


    /**
     * 生成用户的浏览记录
     * @param id
     * @return
     */
    @PostMapping("/views")
    public Result<Boolean> viewGoods(@RequestParam(name = "id", defaultValue = "0") String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser != null) {
            LambdaQueryWrapper<GoodsView> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsView::getGoodsId, id);
            queryWrapper.eq(GoodsView::getMemberId, loginUser.getId());
            if(goodsViewService.count(queryWrapper) == 0) {
                //没有浏览记录，则生成浏览记录
                GoodsView goodsView = new GoodsView();
                goodsView.setGoodsId(id);
                goodsView.setMemberId(loginUser.getId());
                goodsView.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
                goodsView.setMemberAvatar(loginUser.getAvatar());
                goodsViewService.save(goodsView);
                return Result.OK(true);
            }
        }
        return Result.OK(false);
    }

    /**
     * 获取用户的关注记录
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping("/follows")
    public Result<?> queryMemberFollowGoods(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberFollowGoods(loginUser.getId(), page);
        return Result.OK(pageList);
    }


    /**
     * 查询用户是否缴纳了拍品保证金
     * @param id
     * @return
     */
    @GetMapping("/deposited")
    public Result<Boolean> queryGoodsDeposit(@RequestParam(value = "id", defaultValue = "") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        Goods goods = goodsService.getById(id);
        if(goods.getDeposit() == null || goods.getDeposit() <=0) {
            return Result.OK(true);
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getGoodsId, id);
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        return Result.OK(goodsDepositService.count(queryWrapper) > 0);
    }

    /**
     * 判断用户是否关注了拍品
     * @param id
     * @return
     */
    @GetMapping("/isfollow")
    public Result<Boolean> queryGoodsFollow(@RequestParam(name = "id", defaultValue = "") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        LambdaQueryWrapper<GoodsFollow> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsFollow::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsFollow::getGoodsId, id);
        return Result.OK(goodsFollowService.count(queryWrapper) > 0);
    }

    /**
     * 关注或取消关注商品
     * @param params
     * @return
     */
    @PutMapping("/follow/toggle")
    public Result<Boolean> toggleFollow(@RequestBody JSONObject params) {
        String id = params.getString("id");
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsFollow> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsFollow::getGoodsId, id);
        queryWrapper.eq(GoodsFollow::getMemberId, loginUser.getId());


        long count = goodsFollowService.count(queryWrapper);
        if (count > 0) {
            //删除所有关注记录
            goodsFollowService.remove(queryWrapper);
            return Result.OK(false);
        } else {
            GoodsFollow goodsFollow = new GoodsFollow();
            goodsFollow.setGoodsId(id);
            goodsFollow.setMemberId(loginUser.getId());
            goodsFollow.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
            goodsFollow.setMemberAvatar(loginUser.getAvatar());
            goodsFollowService.save(goodsFollow);
            return Result.OK(true);
        }
    }


    /**
     * 出价拍品
     * @return
     */
    @PostMapping("/offers")
    @Transactional
    public Result<?> goodsOffer(@RequestBody JSONObject post) {
        Goods goods = goodsService.getById(post.getString("id"));
        if(goods == null) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        if(new Date().compareTo(goods.getEndTime()) >= 0) {
            throw new JeecgBootException("该拍品已结束拍卖");
        }
        String lockKey = "OFFER-LOCKER-"+goods.getId();
        if(redissonLockClient.tryLock(lockKey, -1, 300)) {
            BigDecimal userOfferPrice = BigDecimal.valueOf(post.getDoubleValue("price"));
            if(userOfferPrice.compareTo(BigDecimal.valueOf(goods.getStartPrice())) < 0) {
                redissonLockClient.unlock(lockKey);
                return Result.error("出价不得低于起拍价");
            }
            Double max = goodsOfferService.getMaxOffer(goods.getId());
            if(max != null && userOfferPrice.compareTo(BigDecimal.valueOf(max)) <= 0) {
                redissonLockClient.unlock(lockKey);
                return Result.error("他人已出此价格或更高的价格");
            }
            LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
            GoodsOffer goodsOffer = new GoodsOffer();
            goodsOffer.setGoodsId(goods.getId());
            goodsOffer.setPrice(userOfferPrice.floatValue());
            goodsOffer.setMemberId(loginUser.getId());
            goodsOffer.setMemberAvatar(loginUser.getAvatar());
            goodsOffer.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
            goodsOffer.setOfferTime(new Date());
            goodsOfferService.save(goodsOffer);

            //在此通知群消息
            redissonLockClient.unlock(lockKey);
            return Result.OK("出价成功");
        }
        else {
            return Result.error("出价失败");
        }
    }
    /**
     * 缴纳保证金，并生成订单
     * @param id
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PostMapping("/deposits")
    @Transactional
    public Result<?> payGoodsDeposit(@RequestParam("id") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        Goods goods = goodsService.getById(id);
        if(goods == null) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        if(goods.getDeposit() == null || goods.getDeposit() <= 0) {
            throw new JeecgBootException("该拍品无需缴纳保证金");
        }

        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();

        GoodsDeposit goodsDeposit = new GoodsDeposit();
        goodsDeposit.setGoodsId(id);
        goodsDeposit.setMemberId(loginUser.getId());
        goodsDeposit.setMemberAvatar(loginUser.getAvatar());
        goodsDeposit.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
        if(StringUtils.isNotEmpty(goods.getPerformanceId())) {
            goodsDeposit.setPerformanceId(goods.getPerformanceId());
            Performance performance = performanceService.getById(goods.getPerformanceId());
            if(performance != null) {
                goodsDeposit.setAuctionId(performance.getAuctionId());
            }
        }
        goodsDeposit.setPrice(goods.getDeposit());
        goodsDeposit.setStatus(0);
        boolean result = goodsDepositService.save(goodsDeposit);
        if(!result) {
            throw new JeecgBootException("支付失败");
        }
        PayLog payLog = getPayLog(goodsDeposit.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        BigDecimal payAmount = BigDecimal.valueOf(goods.getDeposit()).setScale(2, RoundingMode.HALF_DOWN);

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder()
                .notifyUrl(jeecgBaseConfig.getDomainUrl().getApp()+"/paimai/api/members/deposit_notify/"+AppContext.getApp())
                .openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId())
                .body("支付拍品保证金:")
                .spbillCreateIp("127.0.0.1")
                .totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue())
                .detail(goods.getTitle())
                .build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("",wxPayService.createOrder(request));
    }
    @RequestMapping(value = "/deposit_notify/{appId}", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
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

    protected PayLog getPayLog(String ordersn) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        PayLog payLog = new PayLog();
        payLog.setOrdersn(ordersn);
        payLog.setOrderType(1);
        payLog.setMemberId(loginUser.getId());
        payLogService.save(payLog);
        return payLog;
    }

}
