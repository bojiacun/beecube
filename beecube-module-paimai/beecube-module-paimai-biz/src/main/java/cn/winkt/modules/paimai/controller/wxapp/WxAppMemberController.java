package cn.winkt.modules.paimai.controller.wxapp;


import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.ChangeMemberScore;
import cn.winkt.modules.app.vo.MemberSetting;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.*;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.freewayso.image.combiner.ImageCombiner;
import com.freewayso.image.combiner.element.TextElement;
import com.freewayso.image.combiner.enums.Direction;
import com.freewayso.image.combiner.enums.GradientDirection;
import com.freewayso.image.combiner.enums.OutputFormat;
import com.freewayso.image.combiner.enums.ZoomMode;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import io.seata.spring.annotation.GlobalTransactional;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.zhyd.oauth.log.Log;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.CommonUtils;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequestMapping("/api/members")
@RestController
@Slf4j
public class WxAppMemberController {

    @Resource
    IGoodsService goodsService;
    @Resource
    IGoodsFollowService goodsFollowService;
    @Resource
    IMessagePoolService messagePoolService;
    @Resource
    IGoodsViewService goodsViewService;
    @Resource
    ICouponTicketService couponTicketService;
    @Resource
    ILiveRoomService liveRoomService;
    @Resource
    AppApi appApi;

    @Resource
    private IDayTaskService dayTaskService;

    @Resource
    IPayLogService payLogService;
    @Resource
    IGoodsDepositService goodsDepositService;
    @Resource
    IPerformanceService performanceService;
    @Resource
    IGoodsCommonDescService goodsCommonDescService;
    @Resource
    ICouponService couponService;
    @Resource
    JeecgBaseConfig jeecgBaseConfig;

    @Resource
    IGoodsOrderSettlementService goodsOrderSettlementService;
    @Resource
    MiniappServices miniappServices;

    @Resource
    RedissonLockClient redissonLockClient;

    @Resource
    IGoodsOfferService goodsOfferService;

    @Resource
    IGoodsOrderService goodsOrderService;

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsOrderAfterService goodsOrderAfterService;
    @Resource
    AuctionGoodsService auctionGoodsService;

    @Resource
    CommissionService commissionService;


    @Resource
    IPerformanceInviteService performanceInviteService;

    @GetMapping("/quotas")
    public Result<?> quotas() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        MemberQuota memberQuota = new MemberQuota();

        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getStatus, 0);
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        memberQuota.setPayCount(goodsOrderService.count(queryWrapper));

        queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getStatus, 1);
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        memberQuota.setDeliveryCount(goodsOrderService.count(queryWrapper));


        queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getStatus, 2);
        memberQuota.setConfirmDeliveryCount(goodsOrderService.count(queryWrapper));


        //可用优惠券个数
        LambdaQueryWrapper<CouponTicket> couponTicketLambdaQueryWrapper = new LambdaQueryWrapper<>();
        couponTicketLambdaQueryWrapper.eq(CouponTicket::getMemberId, loginUser.getId());
        couponTicketLambdaQueryWrapper.eq(CouponTicket::getStatus, 0);
        couponTicketLambdaQueryWrapper.gt(CouponTicket::getEndTime, new Date());
        memberQuota.setTicketCount(couponTicketService.count(couponTicketLambdaQueryWrapper));

        //关注数量
        LambdaQueryWrapper<GoodsFollow> followLambdaQueryWrapper = new LambdaQueryWrapper<>();
        followLambdaQueryWrapper.eq(GoodsFollow::getMemberId, loginUser.getId());
        memberQuota.setGoodsFollowCount(goodsFollowService.count(followLambdaQueryWrapper));

        //浏览足迹数量
        LambdaQueryWrapper<GoodsView> viewLambdaQueryWrapper = new LambdaQueryWrapper<>();
        viewLambdaQueryWrapper.eq(GoodsView::getMemberId, loginUser.getId());
        memberQuota.setGoodsFollowCount(goodsViewService.count(viewLambdaQueryWrapper));

        return Result.OK(memberQuota);
    }

    @AutoLog(value = "订单售后表-分页列表查询")
    @ApiOperation(value = "订单售后表-分页列表查询", notes = "订单售后表-分页列表查询")
    @GetMapping(value = "/orders/afters")
    public Result<?> queryPageOrderAfterList(GoodsOrderAfter goodsOrderAfter, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<GoodsOrderAfter> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrderAfter, req.getParameterMap());
        Page<GoodsOrderAfter> page = new Page<GoodsOrderAfter>(pageNo, pageSize);
        IPage<GoodsOrderAfterVO> pageList = goodsOrderAfterService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }
    @GetMapping(value = "/coupons")
    public Result<?> queryCouponList(CouponTicket couponTicket, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<CouponTicket> queryWrapper = QueryGenerator.initQueryWrapper(couponTicket, req.getParameterMap());
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        queryWrapper.eq("member_id", loginUser.getId());
        int type = Integer.parseInt(req.getParameter("type"));
        switch (type) {
            case 1:
                queryWrapper.eq("status", 0);
                queryWrapper.gt("end_time", new Date());
                break;
            case 2:
                queryWrapper.eq("status", 1);
                break;
            case 3:
                queryWrapper.lt("end_time", new Date());
                break;
        }

        Page<CouponTicket> page = new Page<>(pageNo, pageSize);
        IPage<CouponTicket> pageList = couponTicketService.page(page, queryWrapper);
        pageList.getRecords().forEach(couponTicket1 -> {
            Coupon coupon = couponService.getById(couponTicket1.getCouponId());
            couponTicket1.setCoupon(coupon);
        });
        return Result.OK(pageList);
    }

    @AutoLog(value = "订单表-支付订单")
    @ApiOperation(value = "订单表-支付订单", notes = "订单表-支付订单")
    @PostMapping(value = "/orders/pay")
    public Result<?> payOrder(@RequestParam(name = "id", defaultValue = "") String id, @RequestBody AddressVO addressVO) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (addressVO == null || StringUtils.isEmpty(addressVO.getId())) {
            throw new JeecgBootException("请选择收货地址");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getId, id);
        GoodsOrder order = goodsOrderService.getOne(queryWrapper);
        if (order.getStatus() != 0) {
            throw new JeecgBootException("订单状态异常，不能支付");
        }

        order.setDeliveryId(addressVO.getId());
        order.setDeliveryUsername(addressVO.getUsername());
        order.setDeliveryCity(addressVO.getCity());
        order.setDeliveryDistrict(addressVO.getDistrict());
        order.setDeliveryPhone(addressVO.getPhone());
        order.setDeliveryAddress(addressVO.getAddress());
        order.setDeliveryProvince(addressVO.getProvince());
        order.setPayType(1);
        order.setDeliveryInfo(String.format("%s %s %s %s %s %s", addressVO.getUsername(), addressVO.getPhone(), addressVO.getProvince(), addressVO.getCity(), addressVO.getDistrict(), addressVO.getAddress()));
        goodsOrderService.updateById(order);

        LambdaQueryWrapper<OrderGoods> orderGoodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
        orderGoodsLambdaQueryWrapper.eq(OrderGoods::getOrderId, id);
        List<OrderGoods> orderGoods = orderGoodsService.list(orderGoodsLambdaQueryWrapper);

        BigDecimal payAmount = BigDecimal.valueOf(order.getPayedPrice()).setScale(2, RoundingMode.HALF_DOWN);
        PayLog payLog = getPayLog(order.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder().notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/orders/" + AppContext.getApp()).openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId()).body("订单支付").spbillCreateIp("127.0.0.1").totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue()).detail(orderGoods.stream().map(OrderGoods::getGoodsName).collect(Collectors.joining(","))).build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
    }


    @AutoLog(value = "订单表-确认收货")
    @ApiOperation(value = "订单表-确认收货", notes = "订单表-确认收货")
    @PutMapping("/confirm_delivery")
    @Transactional(rollbackFor = Exception.class)
    public Result<GoodsOrder> confirmDelivery(@RequestParam String id) {
        GoodsOrder goodsOrder = goodsOrderService.getById(id);
        if (goodsOrder.getStatus() != 2) {
            throw new JeecgBootException("订单状态异常，无法确认收货");
        }
        goodsOrder.setStatus(3);
        goodsOrderService.updateById(goodsOrder);
        commissionService.dispatchComission(goodsOrder);
        return Result.OK(goodsOrder);
    }

    @AutoLog(value = "订单表-取消订单")
    @ApiOperation(value = "订单表-取消订单", notes = "订单表-取消订单")
    @PostMapping(value = "/orders/cancel")
    public Result<?> cancelOrder(@RequestParam(name = "id", defaultValue = "") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getId, id);
        GoodsOrder order = goodsOrderService.getOne(queryWrapper);
        goodsOrderService.cancel(order);
        return Result.OK("取消成功", order);
    }



    @AutoLog(value = "订单表-分页列表查询")
    @ApiOperation(value = "订单表-分页列表查询", notes = "订单表-分页列表查询")
    @GetMapping(value = "/orders")
    public Result<?> queryPageOrderList(GoodsOrder goodsOrder, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<GoodsOrder> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrder, req.getParameterMap());
        queryWrapper.eq("member_id", loginUser.getId());
        Page<GoodsOrder> page = new Page<>(pageNo, pageSize);
        IPage<GoodsOrder> pageList = goodsOrderService.page(page, queryWrapper);
        pageList.getRecords().forEach(r -> {
            LambdaQueryWrapper<OrderGoods> qw = new LambdaQueryWrapper<>();
            qw.eq(OrderGoods::getOrderId, r.getId());
            r.setOrderGoods(orderGoodsService.list(qw));
        });
        return Result.OK(pageList);
    }

    @AutoLog(value = "订单表-订单详情")
    @ApiOperation(value = "订单表-订单详情", notes = "订单表-订单详情")
    @GetMapping(value = "/orders/detail")
    public Result<?> queryOrderDetail(@RequestParam(name = "id", defaultValue = "") String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getId, id);
        GoodsOrder order = goodsOrderService.getOne(queryWrapper);
        LambdaQueryWrapper<OrderGoods> qw = new LambdaQueryWrapper<>();
        qw.eq(OrderGoods::getOrderId, order.getId());
        order.setOrderGoods(orderGoodsService.list(qw));

        //获取settle
        LambdaQueryWrapper<GoodsOrderSettlement> settlementLambdaQueryWrapper = new LambdaQueryWrapper<>();
        settlementLambdaQueryWrapper.eq(GoodsOrderSettlement::getOrderId, id);
        settlementLambdaQueryWrapper.orderByAsc(GoodsOrderSettlement::getSortNum);
        order.setSettlements(goodsOrderSettlementService.list(settlementLambdaQueryWrapper));
        return Result.OK(order);
    }

    @AutoLog(value = "用户保证金列表-分页列表查询")
    @ApiOperation(value = "用户保证金列表-分页列表查询", notes = "用户保证金列表-分页列表查询")
    @GetMapping(value = "/deposits")
    public Result<?> memberGoodsDepositList(GoodsDeposit goodsDeposit, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<GoodsDeposit> queryWrapper = QueryGenerator.initQueryWrapper(goodsDeposit, req.getParameterMap());
        queryWrapper.eq("gd.status", 1);
        queryWrapper.eq("gd.member_id", loginUser.getId());
        Page<GoodsDeposit> page = new Page<GoodsDeposit>(pageNo, pageSize);
        IPage<GoodsDepositVO> pageList = goodsDepositService.selectPageVO(page, queryWrapper);
        pageList.getRecords().forEach(goodsDepositVO -> {
            if(StringUtils.isNotEmpty(goodsDepositVO.getGoodsId())) {
                goodsDepositVO.setGoods(goodsService.getById(goodsDepositVO.getGoodsId()));
            }
            if(StringUtils.isNotEmpty(goodsDepositVO.getPerformanceId())) {
                goodsDepositVO.setPerformance(performanceService.getById(goodsDepositVO.getPerformanceId()));
            }
        });
        return Result.OK(pageList);
    }

    @AutoLog(value = "用户参拍记录列表-分页列表查询")
    @ApiOperation(value = "用户参拍记录列表-分页列表查询", notes = "用户参拍记录列表-分页列表查询")
    @GetMapping(value = "/offers")
    public Result<?> memberOfferList(GoodsOffer goodsOffer, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<GoodsOffer> queryWrapper = QueryGenerator.initQueryWrapper(goodsOffer, req.getParameterMap());
        queryWrapper.eq("gof.member_id", loginUser.getId());
        Page<GoodsOffer> page = new Page<>(pageNo, pageSize);
        IPage<GoodsOfferVO> pageList = goodsOfferService.selectPageVO(page, queryWrapper);
        pageList.getRecords().forEach(goodsOfferVO -> {
            goodsOfferVO.setGoods(goodsService.getById(goodsOfferVO.getGoodsId()));
        });
        return Result.OK(pageList);
    }

    /**
     * 获取用户的浏览记录
     *
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping("/views")
    public Result<?> queryMemberViewGoods(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberViewGoods(loginUser.getId(), page);
        return Result.OK(pageList);
    }


    /**
     * 生成用户的浏览记录
     *
     * @param id
     * @return
     */
    @PostMapping("/views")
    public Result<Boolean> viewGoods(@RequestParam(name = "id", defaultValue = "0") String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser != null) {
            LambdaQueryWrapper<GoodsView> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsView::getGoodsId, id);
            queryWrapper.eq(GoodsView::getMemberId, loginUser.getId());
            if (goodsViewService.count(queryWrapper) == 0) {
                //没有浏览记录，则生成浏览记录
                Goods goods = goodsService.getById(id);
                GoodsView goodsView = new GoodsView();
                goodsView.setGoodsId(id);
                goodsView.setPerformanceId(goods.getPerformanceId());
                if (goods.getPerformanceId() != null) {
                    Performance performance = performanceService.getById(goods.getPerformanceId());
                    if (performance != null) {
                        goodsView.setAuctionId(performance.getAuctionId());
                    }
                }
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
     *
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping("/follows")
    public Result<?> queryMemberFollowGoods(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberFollowGoods(loginUser.getId(), page);
        return Result.OK(pageList);
    }

    /**
     * 查询用户是否缴纳了直播间保证金
     *
     * @param id
     * @return
     */
    @GetMapping("/deposited/liveroom")
    public Result<Boolean> queryLiveRoomDeposit(@RequestParam(value = "id", defaultValue = "") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        LiveRoom liveRoom = liveRoomService.getById(id);
        if (liveRoom.getDeposit() == null || liveRoom.getDeposit() <= 0) {
            return Result.OK(true);
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getRoomId, id);
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        return Result.OK(goodsDepositService.count(queryWrapper) > 0);
    }

    /**
     * 查询用户是否缴纳了本场保证金
     *
     * @param id
     * @return
     */
    @GetMapping("/deposited/performance")
    public Result<Boolean> queryPerformanceDeposit(@RequestParam(value = "id", defaultValue = "") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        Performance performance = performanceService.getById(id);
        if (performance.getDeposit() == null || performance.getDeposit() <= 0) {
            return Result.OK(true);
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getPerformanceId, id);
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        return Result.OK(goodsDepositService.count(queryWrapper) > 0);
    }

    /**
     * 查询用户是否缴纳了拍品保证金
     *
     * @param id
     * @return
     */
    @GetMapping("/deposited")
    public Result<Boolean> queryGoodsDeposit(@RequestParam(value = "id", defaultValue = "") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        Goods goods = goodsService.getById(id);
        return Result.OK(goodsService.checkDeposite(loginUser, goods));
    }

    /**
     * 判断用户是否设置了消息提醒
     *
     * @return
     */
    @GetMapping("/messaged")
    public Result<Boolean> queryMemberMessage(@RequestParam(name = "type", defaultValue = "0") Integer type, @RequestParam(name = "performanceId", defaultValue = "") String performanceId, @RequestParam(name = "goodsId", defaultValue = "") String goodsId, @RequestParam(name = "roomId", defaultValue = "") String roomId) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }

        LambdaQueryWrapper<MessagePool> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessagePool::getMemberId, loginUser.getId());
        queryWrapper.eq(MessagePool::getType, type);
        if (StringUtils.isNotEmpty(performanceId)) {
            queryWrapper.eq(MessagePool::getPerformanceId, performanceId);
        }
        if (StringUtils.isNotEmpty(goodsId)) {
            queryWrapper.eq(MessagePool::getGoodsId, goodsId);
        }
        if (StringUtils.isNotEmpty(roomId)) {
            queryWrapper.eq(MessagePool::getRoomId, roomId);
        }
        return Result.OK(messagePoolService.count(queryWrapper) > 0);
    }

    /**
     * 设置或者取消消息提醒
     *
     * @param params
     * @return
     */
    @PutMapping("/messages/toggle")
    public Result<Boolean> toggleMessages(@RequestBody JSONObject params) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        String performanceId = params.getString("performanceId");
        String goodsId = params.getString("goodsId");
        String roomId = params.getString("roomId");
        Integer type = params.getInteger("type");
        String formId = params.getString("formId");
        String templateId = params.getString("templateId");
        AppMemberVO memberVO = appApi.getMemberById(loginUser.getId());

        LambdaQueryWrapper<MessagePool> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessagePool::getMemberId, loginUser.getId());
        queryWrapper.eq(MessagePool::getType, type);
        if (StringUtils.isNotEmpty(performanceId)) {
            queryWrapper.eq(MessagePool::getPerformanceId, performanceId);
        }
        if (StringUtils.isNotEmpty(goodsId)) {
            queryWrapper.eq(MessagePool::getGoodsId, goodsId);
        }
        if (StringUtils.isNotEmpty(roomId)) {
            queryWrapper.eq(MessagePool::getRoomId, roomId);
        }
        long count = messagePoolService.count(queryWrapper);
        if (count > 0) {
            //删除所有关注记录
            messagePoolService.remove(queryWrapper);
            return Result.OK(false);
        } else {
            MessagePool messagePool = new MessagePool();
            messagePool.setMemberOpenId(memberVO.getWxappOpenid());
            messagePool.setFormId(formId);
            messagePool.setTemplateId(templateId);
            messagePool.setGoodsId(goodsId);
            messagePool.setPerformanceId(performanceId);
            messagePool.setRoomId(roomId);
            messagePool.setType(type);
            messagePool.setMemberId(loginUser.getId());
            //这里计算好发送时间和内容
            if (StringUtils.isNotEmpty(performanceId)) {
                Performance performance = performanceService.getById(performanceId);
                if (type == 1) {
                    messagePool.setMessage(String.format("%s快开始了", performance.getTitle()));
                    messagePool.setSendTime(performance.getStartTime());
                } else if (type == 2) {
                    messagePool.setMessage(String.format("%s即将结束", performance.getTitle()));
                    messagePool.setSendTime(performance.getEndTime());
                }
            }
            if (StringUtils.isNotEmpty(goodsId)) {
                Goods goods = goodsService.getById(goodsId);
                if (type == 1) {
                    messagePool.setMessage(String.format("%s即将开始", goods.getTitle()));
                    messagePool.setSendTime(goods.getStartTime());
                } else if (type == 2) {
                    messagePool.setMessage(String.format("%s即将结束", goods.getTitle()));
                    messagePool.setSendTime(goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime());
                }
            }
            messagePoolService.save(messagePool);
            return Result.OK(true);
        }
    }

    /**
     * 判断用户是否关注了拍品
     *
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
     *
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
            Goods goods = goodsService.getById(id);
            GoodsFollow goodsFollow = new GoodsFollow();
            goodsFollow.setGoodsId(id);
            goodsFollow.setPerformanceId(goods.getPerformanceId());
            if (goods.getPerformanceId() != null) {
                Performance performance = performanceService.getById(goods.getPerformanceId());
                if (performance != null) {
                    goodsFollow.setAuctionId(performance.getAuctionId());
                }
            }
            goodsFollow.setMemberId(loginUser.getId());
            goodsFollow.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
            goodsFollow.setMemberAvatar(loginUser.getAvatar());
            goodsFollowService.save(goodsFollow);
            return Result.OK(true);
        }
    }


    /**
     * 一口价购买
     *
     * @param postOrderVO
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PostMapping("/goods/buy")
    @GlobalTransactional(rollbackFor = Exception.class)
    public Result<?> payGoodsDeposit(@RequestBody PostOrderVO postOrderVO) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (postOrderVO.getAddress() == null) {
            throw new JeecgBootException("请选择有效的收货地址");
        }
        if(postOrderVO.getPayedPrice() == null) {
            postOrderVO.setPayedPrice(BigDecimal.ZERO);
        }
        GoodsSettings goodsSettings = goodsCommonDescService.queryGoodsSettings();
        BigDecimal integralRatio = new BigDecimal(StringUtils.getIfEmpty(goodsSettings.getIntegralRatio(), ()->"100"));
        //检测用户使用积分
        BigDecimal integralPrice = BigDecimal.ZERO;
        BigDecimal totalPrice = BigDecimal.ZERO;
        BigDecimal payedPrice;
        for (GoodsVO goodsVO1 : postOrderVO.getGoodsList()) {
            Goods goods = goodsService.getById(goodsVO1.getId());
            if (goods.getMaxIntegralPercent() != null) {
                integralPrice = integralPrice.add(BigDecimal.valueOf(goodsVO1.getCount()).multiply(BigDecimal.valueOf(goods.getMaxIntegralPercent()).divide(BigDecimal.valueOf(100), RoundingMode.CEILING).multiply(goods.getStartPrice())));
            }
            totalPrice = totalPrice.add(BigDecimal.valueOf(goodsVO1.getCount()).multiply(goods.getStartPrice()));
        }
        if(postOrderVO.getUseIntegral() != null && integralPrice.compareTo(postOrderVO.getUseIntegral()) < 0) {
            throw new JeecgBootException("价格计算有误");
        }
        payedPrice = BigDecimal.valueOf(totalPrice.doubleValue());
        //检测用户使用的优惠券
        CouponTicket ticket = null;
        Coupon coupon = null;
        if(StringUtils.isNotEmpty(postOrderVO.getTicketId())) {
            ticket = couponTicketService.getById(postOrderVO.getTicketId());
            coupon = couponService.getById(ticket.getCouponId());
            if(!couponTicketService.canTicketUseful(postOrderVO.getTicketId(), Arrays.asList(postOrderVO.getGoodsList()))) {
                throw new JeecgBootException("优惠券无法使用");
            }
            payedPrice = payedPrice.subtract(coupon.getAmount());
        }
        if(postOrderVO.getUseIntegral() != null) {
            payedPrice = payedPrice.subtract(postOrderVO.getUseIntegral());
        }

        if(payedPrice.compareTo(postOrderVO.getPayedPrice()) != 0) {
            throw new JeecgBootException("价格计算错误, 无法支付");
        }

        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();

        String lock = "BUYOUT-" + AppContext.getApp();
        //检测库存
        if (redissonLockClient.tryLock(lock, -1, 2)) {
            Arrays.stream(postOrderVO.getGoodsList()).forEach(goodsVO -> {
                Goods goods = goodsService.getById(goodsVO.getId());
                if (goods.getStock() == null || goodsVO.getCount() > goods.getStock()) {
                    throw new JeecgBootException("商品" + goodsVO.getTitle() + "库存不足");
                }
                goods.setStock(goods.getStock() - goodsVO.getCount());
                goodsService.updateById(goods);
            });

            BigDecimal payAmount = payedPrice.setScale(2, RoundingMode.CEILING);
            //创建订单
            GoodsOrder goodsOrder = new GoodsOrder();
            goodsOrder.setType(2);
            goodsOrder.setNote(postOrderVO.getNote());
            goodsOrder.setMemberId(loginUser.getId());
            goodsOrder.setMemberName(StringUtils.getIfEmpty(loginUser.getRealname(), loginUser::getPhone));
            goodsOrder.setMemberAvatar(loginUser.getAvatar());
            goodsOrder.setDeliveryInfo(String.format("%s %s %s %s %s %s", postOrderVO.getAddress().getUsername(), postOrderVO.getAddress().getPhone(), postOrderVO.getAddress().getProvince(), postOrderVO.getAddress().getCity(), postOrderVO.getAddress().getDistrict(), postOrderVO.getAddress().getAddress()));
            goodsOrder.setDeliveryId(postOrderVO.getAddress().getId());
            goodsOrder.setDeliveryAddress(postOrderVO.getAddress().getAddress());
            goodsOrder.setDeliveryPhone(postOrderVO.getAddress().getPhone());
            goodsOrder.setDeliveryUsername(postOrderVO.getAddress().getUsername());
            goodsOrder.setDeliveryCity(postOrderVO.getAddress().getCity());
            goodsOrder.setDeliveryDistrict(postOrderVO.getAddress().getDistrict());
            goodsOrder.setDeliveryProvince(postOrderVO.getAddress().getProvince());
            goodsOrder.setUsedIntegral(postOrderVO.getUseIntegral().multiply(integralRatio));
            if(ticket != null) {
                goodsOrder.setUsedCouponTicketId(ticket.getId());
            }
            goodsOrder.setPayedPrice(payAmount.floatValue());
            goodsOrder.setTotalPrice(totalPrice.floatValue());
            goodsOrder.setStatus(0);
            goodsOrder.setPayType(postOrderVO.getPayType());
            goodsOrderService.save(goodsOrder);


            //settle
            GoodsOrderSettlement settlement = new GoodsOrderSettlement();
            settlement.setSortNum(0);
            settlement.setAmount("+ "+totalPrice);
            settlement.setDescription("商品总价");
            settlement.setOrderId(goodsOrder.getId());
            goodsOrderSettlementService.save(settlement);

            if(postOrderVO.getUseIntegral().compareTo(BigDecimal.ZERO) > 0) {
                settlement = new GoodsOrderSettlement();
                settlement.setSortNum(1);
                settlement.setAmount("- " + postOrderVO.getUseIntegral());
                settlement.setDescription("积分抵扣");
                settlement.setOrderId(goodsOrder.getId());
                goodsOrderSettlementService.save(settlement);
            }

            if(ticket != null) {
                ticket.setStatus(1);
                ticket.setUsedTime(new Date());
                ticket.setUseOrderId(goodsOrder.getId());
                couponTicketService.updateById(ticket);
                settlement = new GoodsOrderSettlement();
                settlement.setSortNum(2);
                settlement.setAmount("- " + coupon.getAmount());
                settlement.setDescription("优惠券抵扣");
                settlement.setOrderId(goodsOrder.getId());
                goodsOrderSettlementService.save(settlement);
            }

            settlement = new GoodsOrderSettlement();
            settlement.setSortNum(3);
            settlement.setAmount("+ " + postOrderVO.getDeliveryPrice());
            settlement.setDescription("运费");
            settlement.setOrderId(goodsOrder.getId());
            goodsOrderSettlementService.save(settlement);

            //扣除用户积分
            if(postOrderVO.getUseIntegral().compareTo(BigDecimal.ZERO) > 0) {
                ChangeMemberScore changeMemberScore = new ChangeMemberScore();
                changeMemberScore.setAmount(postOrderVO.getUseIntegral().multiply(integralRatio).negate());
                changeMemberScore.setDescription(String.format("下单消费，订单号为：%s", goodsOrder.getId()));
                changeMemberScore.setMemberId(loginUser.getId());
                if(!appApi.reduceMemberScore(changeMemberScore)) {
                    throw new JeecgBootException("积分不足");
                }
            }

            //增加订单商品
            Arrays.stream(postOrderVO.getGoodsList()).forEach(goodsVO -> {
                OrderGoods orderGoods = new OrderGoods();
                orderGoods.setGoodsCount(goodsVO.getCount());
                orderGoods.setGoodsPrice(goodsVO.getStartPrice());
                orderGoods.setGoodsId(goodsVO.getId());
                orderGoods.setGoodsName(goodsVO.getTitle());
                orderGoods.setOrderId(goodsOrder.getId());
                orderGoods.setGoodsImage(goodsVO.getImages().split(",")[0]);
                orderGoodsService.save(orderGoods);
            });


            //每日首次下单送积分
            MemberSetting memberSetting = appApi.queryMemberSettings();
            if(memberSetting != null && StringUtils.isNotEmpty(memberSetting.getBuyIntegral()) && !dayTaskService.todayTasked(2)) {
                ChangeMemberScore changeMemberScore = new ChangeMemberScore();
                changeMemberScore.setAmount(new BigDecimal(memberSetting.getBuyIntegral()));
                changeMemberScore.setMemberId(loginUser.getId());
                changeMemberScore.setDescription("每日下单送积分");
                appApi.reduceMemberScore(changeMemberScore);
                dayTaskService.saveTask(2);
            }


            PayLog payLog = getPayLog(goodsOrder.getId());
            AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
            if(goodsOrder.getPayType() == 1) {
                WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder().notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/buyout/" + AppContext.getApp()).openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId()).body("支付一口价订单").spbillCreateIp("127.0.0.1").totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue()).detail(Arrays.stream(postOrderVO.getGoodsList()).map(GoodsVO::getTitle).collect(Collectors.joining(";"))).build();
                WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
                Object payResult = wxPayService.createOrder(request);
                redissonLockClient.unlock(lock);
                return Result.OK("", payResult);
            }
            else {
                redissonLockClient.unlock(lock);
                return Result.OK("下单成功");
            }
        } else {
            return Result.error("下单失败");
        }
    }

    @GetMapping("/check")
    public Result<Boolean> checkUserInfo() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        //用户实名检测，必须绑定手机号才可出价
        AppMemberVO memberVO = appApi.getMemberById(loginUser.getId());
        return Result.OK(!StringUtils.isAnyEmpty(memberVO.getNickname(), memberVO.getPhone(), memberVO.getAvatar()));
    }

    @GetMapping("/invites")
    public Result<PerformanceInvite> queryMyInvite(@RequestParam String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<PerformanceInvite> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PerformanceInvite::getMemberId, loginUser.getId());
        queryWrapper.eq(PerformanceInvite::getPerformanceId, id);
        return Result.OK(performanceInviteService.getOne(queryWrapper));
    }
    @PostMapping("/invites")
    public Result<Boolean> inviteJoin(@RequestBody PerformanceInvite invite, @RequestParam String id) {
        Performance performance = performanceService.getById(id);
        if(performance == null){
            throw new JeecgBootException("找不到专场");
        }
        if(performance.getType() == 1 && performance.getEndTime().before(new Date())) {
            throw new JeecgBootException("专场已结束");
        }
        if(performance.getType() == 1 && performance.getState() >= 2) {
            throw new JeecgBootException("专场已结束");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMemberVO member = appApi.getMemberById(loginUser.getId());
        invite.setPerformanceId(performance.getId());
        invite.setNickname(member.getNickname());
        invite.setAvatar(member.getAvatar());
        invite.setMemberId(loginUser.getId());

        String vcode = RandomStringUtils.randomNumeric(6);
        invite.setInviteCode(vcode);

        performanceInviteService.save(invite);

        return Result.OK(true);
    }
    /**
     * 出价拍品
     *
     * @return
     */
    @PostMapping("/offers")
    public Result<?> goodsOffer(@RequestBody JSONObject post) {
        return auctionGoodsService.offer(post);
    }

    /**
     * 缴纳直播间保证金
     *
     * @param id
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PostMapping("/deposits/liveroom")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> payLiveRoomDeposit(@RequestParam("id") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到直播间");
        }
        LiveRoom liveRoom = liveRoomService.getById(id);
        if (liveRoom == null) {
            throw new JeecgBootException("操作失败找不到直播间");
        }
        if (liveRoom.getDeposit() == null || liveRoom.getDeposit() <= 0) {
            throw new JeecgBootException("该直播间无需缴纳保证金");
        }
        //专场结束不能缴纳保证金
        if (liveRoom.getEndTime().before(new Date())) {
            throw new JeecgBootException("直播间已结束无法缴纳保证金");
        }

        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        //查询用户是否已经缴纳保证金
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getRoomId, id);

        if (goodsDepositService.count(queryWrapper) > 0) {
            throw new JeecgBootException("您已经缴纳本直播间保证金");
        }


        GoodsDeposit goodsDeposit = new GoodsDeposit();
        goodsDeposit.setPerformanceId(id);
        goodsDeposit.setMemberId(loginUser.getId());
        goodsDeposit.setMemberAvatar(loginUser.getAvatar());
        goodsDeposit.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
        goodsDeposit.setRoomId(liveRoom.getId());
        goodsDeposit.setPrice(liveRoom.getDeposit());
        goodsDeposit.setStatus(0);
        boolean result = goodsDepositService.save(goodsDeposit);
        if (!result) {
            throw new JeecgBootException("支付失败");
        }
        PayLog payLog = getPayLog(goodsDeposit.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        BigDecimal payAmount = BigDecimal.valueOf(liveRoom.getDeposit()).setScale(2, RoundingMode.HALF_DOWN);

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder().notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/deposit/" + AppContext.getApp()).openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId()).body("支付直播间保证金:").spbillCreateIp("127.0.0.1").totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue()).detail(liveRoom.getTitle()).build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
    }

    /**
     * 缴纳专场保证金
     *
     * @param id
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PostMapping("/deposits/performance")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> payPerformanceDeposit(@RequestParam("id") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到专场");
        }
        Performance performance = performanceService.getById(id);
        if (performance == null) {
            throw new JeecgBootException("操作失败找不到专场");
        }
        if (performance.getDeposit() == null || performance.getDeposit() <= 0) {
            throw new JeecgBootException("该专场无需缴纳保证金");
        }
        //专场结束不能缴纳保证金
        if (performanceService.isEnded(performance)) {
            throw new JeecgBootException("专场已结束无法缴纳保证金");
        }

        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        //查询用户是否已经缴纳保证金
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getPerformanceId, id);

        if (goodsDepositService.count(queryWrapper) > 0) {
            throw new JeecgBootException("您已经缴纳本场保证金");
        }


        GoodsDeposit goodsDeposit = new GoodsDeposit();
        goodsDeposit.setPerformanceId(id);
        goodsDeposit.setMemberId(loginUser.getId());
        goodsDeposit.setMemberAvatar(loginUser.getAvatar());
        goodsDeposit.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
        goodsDeposit.setAuctionId(performance.getAuctionId());
        goodsDeposit.setPrice(performance.getDeposit());
        goodsDeposit.setStatus(0);
        boolean result = goodsDepositService.save(goodsDeposit);
        if (!result) {
            throw new JeecgBootException("支付失败");
        }
        PayLog payLog = getPayLog(goodsDeposit.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        BigDecimal payAmount = BigDecimal.valueOf(performance.getDeposit()).setScale(2, RoundingMode.HALF_DOWN);

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder().notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/deposit/" + AppContext.getApp()).openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId()).body("支付专场保证金:").spbillCreateIp("127.0.0.1").totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue()).detail(performance.getTitle()).build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
    }

    /**
     * 缴纳拍品保证金，并生成订单
     *
     * @param id
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PostMapping("/deposits")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> payGoodsDeposit(@RequestParam("id") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        Goods goods = goodsService.getById(id);
        if (goods == null) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        Performance performance = performanceService.getById(goods.getPerformanceId());
        LiveRoom liveRoom = liveRoomService.getById(goods.getRoomId());
        if (performance != null) {
            if (performance.getDeposit() == null || performance.getDeposit() <= 0) {
                throw new JeecgBootException("该拍品无需缴纳保证金");
            }
            //专场结束不能缴纳保证金
            if ((performance.getType() == 1 && performance.getEndTime().before(new Date())) || (performance.getType() == 2 && performance.getState() > 1)) {
                throw new JeecgBootException("专场已结束无法缴纳保证金");
            }
        } else if(liveRoom != null){
            if (liveRoom.getDeposit() == null || liveRoom.getDeposit() <= 0) {
                throw new JeecgBootException("该拍品无需缴纳保证金");
            }
            if (liveRoom.getEndTime().before(new Date())) {
                throw new JeecgBootException("直播已结束无法缴纳保证金");
            }
        }else {
            if (goods.getDeposit() == null || goods.getDeposit() <= 0) {
                throw new JeecgBootException("该拍品无需缴纳保证金");
            }
        }
        //验证拍品是否结束
        if (goodsService.isEnded(goods)) {
            throw new JeecgBootException("拍品已结束无法缴纳保证金");
        }

        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();

        //查询用户是否已经缴纳保证金
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            queryWrapper.and(wq -> {
                wq.eq(GoodsDeposit::getGoodsId, goods.getId()).or().eq(GoodsDeposit::getPerformanceId, goods.getPerformanceId());
            });
        } else {
            queryWrapper.eq(GoodsDeposit::getGoodsId, goods.getId());
        }
        if (goodsDepositService.count(queryWrapper) > 0) {
            throw new JeecgBootException("您已经缴纳本拍品或本场保证金");
        }

        Float deposit = goods.getDeposit();

        GoodsDeposit goodsDeposit = new GoodsDeposit();
        goodsDeposit.setGoodsId(id);
        goodsDeposit.setMemberId(loginUser.getId());
        goodsDeposit.setMemberAvatar(loginUser.getAvatar());
        goodsDeposit.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
        if (performance != null) {
            goodsDeposit.setPerformanceId(goods.getPerformanceId());
            goodsDeposit.setAuctionId(performance.getAuctionId());
            deposit = performance.getDeposit();
        }
        if(liveRoom != null) {
            goodsDeposit.setRoomId(goods.getRoomId());
            deposit = liveRoom.getDeposit();
        }
        goodsDeposit.setPrice(deposit);
        goodsDeposit.setStatus(0);
        boolean result = goodsDepositService.save(goodsDeposit);
        if (!result) {
            throw new JeecgBootException("支付失败");
        }
        PayLog payLog = getPayLog(goodsDeposit.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        BigDecimal payAmount = BigDecimal.valueOf(deposit).setScale(2, RoundingMode.HALF_DOWN);

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder().notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/deposit/" + AppContext.getApp()).openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId()).body("支付拍品保证金:").spbillCreateIp("127.0.0.1").totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue()).detail(goods.getTitle()).build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
    }

    @GetMapping("/share/goods")
    public void generateGoodsShareAdv(@RequestParam String id, HttpServletResponse response) throws Exception {
        Goods goods = goodsService.getById(id);
        if (goods == null) {
            throw new JeecgBootException("找不到商品");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        ByteArrayInputStream qrCodeStream = new ByteArrayInputStream(appApi.getMemberQrcode("/pages/goods/detail"+(goods.getType()==1?"":"2")+"?id=" + id + "&mid=" + loginUser.getId()));
        BufferedImage qrCode = ImageIO.read(qrCodeStream);
        String productImageUrl = goods.getImages().split(",")[0];
        String title = goods.getTitle();
        String content = goods.getSubTitle();
        int canvasHeight = 680;
        int canvasWidth = 390;

//        ImageCombiner combiner = new ImageCombiner(bgImageUrl, 375, 812, ZoomMode.Height,  OutputFormat.JPEG);
        ImageCombiner combiner = new ImageCombiner( canvasWidth, canvasHeight, Color.WHITE,  OutputFormat.JPEG);
        int baseX = 20;
        int baseY = 391;

        //商品图（设置坐标、宽高和缩放模式，若按宽度缩放，则高度按比例自动计算）
        combiner.addImageElement(productImageUrl, 0, 0, 0, 375, ZoomMode.Height)
                .setCenter(true);       //居中绘制（会忽略x坐标，改为自动计算
//                .setRoundCorner(46);    //设置圆角


        //针对背景和整图的设置
//        combiner.setBackgroundBlur(30);     //设置背景高斯模糊（毛玻璃效果）
//        combiner.setCanvasRoundCorner(0); //设置整图圆角（输出格式必须为PNG）
        combiner.setQuality(1f);           //设置图片保存质量（0.0~1.0，Java9以下仅jpg格式有效）
        //标题（默认字体为阿里普惠、黑色，也可以自己指定Font对象）
        TextElement titleElement = combiner.addTextElement(title, Font.BOLD, 24, baseX, baseY)
                .setSpace(.1f)
                .setAutoBreakLine(335, 2, 30);
//                .setCenter(true)        //居中绘制（会忽略x坐标，改为自动计算）
//                .setAlpha(.8f)          //透明度（0.0~1.0）
//                .setRotate(45)          //旋转（0~360）
//                .setColor(Color.RED)    //颜色
//                .setDirection(Direction.RightLeft) //绘制方向（从右到左，用于需要右对齐场景）
//                .setAutoFitWidth(720);  //自适应最大宽度（超出则自动缩小字体）

        baseY += titleElement.getBreakLineElements().size() * 30;

        if(content != null) {
            baseY+=16;
            //副标题（v2.6.3版本开始支持加载项目内字体文件，可以不用在服务器安装，性能略低）
            combiner.addTextElement(content, 16, baseX, baseY)
                    .setSpace(.1f)
                    .setColor(Color.gray)
                    .setAutoFitWidth(335);
            baseY+=16;
        }

        baseY += 16;
        //内容（设置文本自动换行，需要指定最大宽度（超出则换行）、最大行数（超出则丢弃）、行高）
//        combiner.addTextElement(content,  Font.BOLD, 40, 150, 600)
//                .setSpace(.5f)                      //字间距
//                .setStrikeThrough(true)             //删除线
//                .setAutoBreakLine(837, 2, 60);      //自动换行（还有一个LineAlign参数可以指定对齐方式）

        //价格（元素对象也可以直接new，然后手动加入待绘制列表）
        TextElement textPrice = new TextElement("￥ "+goods.getStartPrice(), 32, baseX, baseY);
        textPrice.setLineHeight(36);
        textPrice.setColor(Color.red);          //红色
        combiner.addElement(textPrice);         //加入待绘制集合





        //头像（圆角设置一定的大小，可以把头像变成圆的）
//        combiner.addImageElement(avatarUrl, 0, 500)
//                .setRoundCorner(200);   //圆角
//
        //水印（设置透明度，0.0~1.0）
//        combiner.addImageElement(waterMark, 630, 1200)
//                .setAlpha(.8f)          //透明度（0.0~1.0）
//                .setRotate(45)          //旋转（0~360）
//                .setBlur(20)            //高斯模糊(1~100)
//                .setRepeat(true, 100, 50);    //平铺绘制（可设置水平、垂直间距）

        //加入圆角矩形元素（版本>=1.2.0），作为二维码的底衬
//        combiner.addRectangleElement(20, 600, 186, 186)
//                .setColor(Color.WHITE)
//                .setRoundCorner(50)     //该值大于等于宽高时，就是圆形，如设为300
//                .setAlpha(.8f)
//                .setGradient(Color.yellow,Color.blue, GradientDirection.LeftRight)  //颜色渐变
//                .setBorderSize(5);      //设置border大小就是空心，不设置就是实心

        //二维码（强制按指定宽度、高度缩放）
        //这里重新计算二维码的高度坐标从底部开始算起
        baseY = canvasHeight - 16 - 110;

        combiner.addImageElement(qrCode, baseX, baseY, 110, 110, ZoomMode.WidthHeight);
        baseX += 125;
        baseY += 25;
        //获取后台设置的小程序名称
        LambdaQueryWrapper<GoodsCommonDesc> commonDescLambdaQueryWrapper = new LambdaQueryWrapper<>();
        commonDescLambdaQueryWrapper.eq(GoodsCommonDesc::getDescKey, "wxAppName");
        GoodsCommonDesc desc = goodsCommonDescService.getOne(commonDescLambdaQueryWrapper);
        String wxAppName = desc == null ? "蜜蜂魔方" : desc.getDescValue();
        String notice = "长按识别小程序 立即购买";
        String notice2 = "分享自"+wxAppName;
        combiner.addTextElement(notice,  18, baseX, baseY)
                .setSpace(.1f);
        baseY += 36;
        combiner.addTextElement(notice2,  18, baseX, baseY)
                .setSpace(.1f)
                .setAutoFitWidth(205);
        //执行图片合并
        combiner.combine();

        //可以获取流（并上传oss等）
        InputStream is = combiner.getCombinedImageStream();
        OutputStream os = null;
        try {
//        读取图片
            BufferedImage image = ImageIO.read(is);
            response.setContentType("image/png");
            os = response.getOutputStream();

            if (image != null) {
                ImageIO.write(image, "png", os);
            }
        } catch (IOException e) {
            log.error("获取图片异常{}",e.getMessage());
        } finally {
            if (os != null) {
                os.flush();
                os.close();
            }
        }
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
