package cn.winkt.modules.paimai.controller.wxapp;


import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.*;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.boot.starter.lock.client.RedissonLockClient;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/paimai/api/members")
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

    @Resource
    IGoodsOrderService goodsOrderService;

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsOrderAfterService goodsOrderAfterService;
    @Resource
    AuctionGoodsService auctionGoodsService;

    @AutoLog(value = "订单售后表-分页列表查询")
    @ApiOperation(value = "订单售后表-分页列表查询", notes = "订单售后表-分页列表查询")
    @GetMapping(value = "/orders/afters")
    @AutoDict
    public Result<?> queryPageOrderAfterList(GoodsOrderAfter goodsOrderAfter,
                                             @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                             @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                             HttpServletRequest req) {
        QueryWrapper<GoodsOrderAfter> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrderAfter, req.getParameterMap());
        Page<GoodsOrderAfter> page = new Page<GoodsOrderAfter>(pageNo, pageSize);
        IPage<GoodsOrderAfterVO> pageList = goodsOrderAfterService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }


    @AutoLog(value = "订单表-支付订单")
    @ApiOperation(value = "订单表-支付订单", notes = "订单表-支付订单")
    @PostMapping(value = "/orders/pay")
    public Result<?> payOrder(@RequestParam(name = "id", defaultValue = "") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getId, id);
        GoodsOrder order = goodsOrderService.getOne(queryWrapper);

        LambdaQueryWrapper<OrderGoods> orderGoodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
        orderGoodsLambdaQueryWrapper.eq(OrderGoods::getOrderId, id);
        List<OrderGoods> orderGoods = orderGoodsService.list(orderGoodsLambdaQueryWrapper);

        BigDecimal payAmount = BigDecimal.valueOf(order.getPayedPrice()).setScale(2, RoundingMode.HALF_DOWN);
        PayLog payLog = getPayLog(order.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder()
                .notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/orders/" + AppContext.getApp())
                .openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId())
                .body("订单支付")
                .spbillCreateIp("127.0.0.1")
                .totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue())
                .detail(orderGoods.stream().map(OrderGoods::getGoodsName).collect(Collectors.joining(",")))
                .build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
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

        if(order.getTransactionId() != null) {
            Integer refundAmount = BigDecimal.valueOf(order.getPayedPrice()).multiply(BigDecimal.valueOf(100)).intValue();
            log.info("原路返回支付金额 {}", refundAmount);
            WxPayRefundRequest refundRequest = WxPayRefundRequest.newBuilder()
                    .transactionId(order.getTransactionId())
                    .outRefundNo(order.getId())
                    .totalFee(refundAmount)
                    .refundFee(refundAmount)
                    .build();
            WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
            WxPayRefundResult result = wxPayService.refund(refundRequest);
            if (!"SUCCESS".equals(result.getReturnCode()) || !"SUCCESS".equals(result.getResultCode())) {
                throw new JeecgBootException("退款失败");
            }
        }
        return Result.OK("取消成功", order);
    }


    @AutoLog(value = "订单表-分页列表查询")
    @ApiOperation(value = "订单表-分页列表查询", notes = "订单表-分页列表查询")
    @GetMapping(value = "/orders")
    @AutoDict
    public Result<?> queryPageOrderList(GoodsOrder goodsOrder,
                                        @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                        @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                        HttpServletRequest req) {
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
    @AutoDict
    public Result<?> queryOrderDetail(@RequestParam(name = "id", defaultValue = "") String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getId, id);
        GoodsOrder order = goodsOrderService.getOne(queryWrapper);
        LambdaQueryWrapper<OrderGoods> qw = new LambdaQueryWrapper<>();
        qw.eq(OrderGoods::getOrderId, order.getId());
        order.setOrderGoods(orderGoodsService.list(qw));
        return Result.OK(order);
    }

    @AutoLog(value = "用户保证金列表-分页列表查询")
    @ApiOperation(value = "用户保证金列表-分页列表查询", notes = "用户保证金列表-分页列表查询")
    @GetMapping(value = "/deposits")
    @AutoDict
    public Result<?> memberGoodsDepositList(GoodsDeposit goodsDeposit,
                                            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                            HttpServletRequest req) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<GoodsDeposit> queryWrapper = QueryGenerator.initQueryWrapper(goodsDeposit, req.getParameterMap());
        queryWrapper.eq("gd.status", 1);
        queryWrapper.eq("gd.member_id", loginUser.getId());
        Page<GoodsDeposit> page = new Page<GoodsDeposit>(pageNo, pageSize);
        IPage<GoodsDepositVO> pageList = goodsDepositService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }

    @AutoLog(value = "用户参拍记录列表-分页列表查询")
    @ApiOperation(value = "用户参拍记录列表-分页列表查询", notes = "用户参拍记录列表-分页列表查询")
    @GetMapping(value = "/offers")
    @AutoDict
    public Result<?> memberOfferList(GoodsOffer goodsOffer,
                                     @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                     @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                     HttpServletRequest req) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<GoodsOffer> queryWrapper = QueryGenerator.initQueryWrapper(goodsOffer, req.getParameterMap());
        queryWrapper.eq("gof.member_id", loginUser.getId());
        Page<GoodsOffer> page = new Page<>(pageNo, pageSize);
        IPage<GoodsOfferVO> pageList = goodsOfferService.selectPageVO(page, queryWrapper);
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
    public Result<?> queryMemberViewGoods(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
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
    public Result<?> queryMemberFollowGoods(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberFollowGoods(loginUser.getId(), page);
        return Result.OK(pageList);
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
        Goods goods = goodsService.getById(id);
        if (goods.getDeposit() == null || goods.getDeposit() <= 0) {
            return Result.OK(true);
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            queryWrapper.and(wq -> {
                wq.eq(GoodsDeposit::getGoodsId, id).or().eq(GoodsDeposit::getPerformanceId, goods.getPerformanceId());
            });
        } else {
            queryWrapper.eq(GoodsDeposit::getGoodsId, id);
        }
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        return Result.OK(goodsDepositService.count(queryWrapper) > 0);
    }

    /**
     * 判断用户是否设置了消息提醒
     *
     * @return
     */
    @GetMapping("/messaged")
    public Result<Boolean> queryMemberMessage(
            @RequestParam(name = "type", defaultValue = "0") Integer type,
            @RequestParam(name = "performanceId", defaultValue = "") String performanceId,
            @RequestParam(name = "goodsId", defaultValue = "") String goodsId
    ) {
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
            messagePool.setType(type);
            messagePool.setMemberId(loginUser.getId());
            //这里计算好发送时间和内容
            if (StringUtils.isNotEmpty(performanceId)) {
                Performance performance = performanceService.getById(performanceId);
                if (type == 1) {
                    messagePool.setMessage(String.format("%s快开始了", performance.getTitle()));
                    messagePool.setSendTime(DateUtils.addHours(performance.getStartTime(), -2));
                } else if (type == 2) {
                    messagePool.setMessage(String.format("%s即将结束", performance.getTitle()));
                    messagePool.setSendTime(DateUtils.addHours(performance.getEndTime(), -2));
                }
            }
            if (StringUtils.isNotEmpty(goodsId)) {
                Goods goods = goodsService.getById(goodsId);
                if (type == 1) {
                    messagePool.setMessage(String.format("%s即将开始", goods.getTitle()));
                    messagePool.setSendTime(DateUtils.addHours(goods.getStartTime(), -2));
                } else if (type == 2) {
                    messagePool.setMessage(String.format("%s即将结束", goods.getTitle()));
                    messagePool.setSendTime(DateUtils.addHours(goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime(), -2));
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
    @Transactional
    public Result<?> payGoodsDeposit(@RequestBody PostOrderVO postOrderVO) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (postOrderVO.getAddress() == null) {
            throw new JeecgBootException("请选择有效的收货地址");
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

            BigDecimal payAmount = BigDecimal.ZERO.setScale(2, RoundingMode.CEILING);
            for (GoodsVO vo : postOrderVO.getGoodsList()) {
                BigDecimal totalPrice = BigDecimal.valueOf(vo.getStartPrice()).multiply(BigDecimal.valueOf(vo.getCount()));
                payAmount = payAmount.add(totalPrice);
            }
            //创建订单
            GoodsOrder goodsOrder = new GoodsOrder();
            goodsOrder.setType(2);
            goodsOrder.setMemberId(loginUser.getId());
            goodsOrder.setMemberName(StringUtils.getIfEmpty(loginUser.getRealname(), loginUser::getPhone));
            goodsOrder.setMemberAvatar(loginUser.getAvatar());
            goodsOrder.setDeliveryInfo(String.format("%s %s %s", postOrderVO.getAddress().getUsername(), postOrderVO.getAddress().getPhone(), postOrderVO.getAddress().getAddress()));
            goodsOrder.setDeliveryId(postOrderVO.getAddress().getId());
            goodsOrder.setDeliveryAddress(postOrderVO.getAddress().getAddress());
            goodsOrder.setDeliveryPhone(postOrderVO.getAddress().getPhone());
            goodsOrder.setDeliveryUsername(postOrderVO.getAddress().getUsername());
            goodsOrder.setDeliveryCity(postOrderVO.getAddress().getCity());
            goodsOrder.setDeliveryDistrict(postOrderVO.getAddress().getDistrict());
            goodsOrder.setDeliveryProvince(postOrderVO.getAddress().getProvince());

            goodsOrder.setPayedPrice(payAmount.floatValue());
            goodsOrder.setTotalPrice(payAmount.floatValue());
            goodsOrder.setStatus(0);

            goodsOrderService.save(goodsOrder);

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


            PayLog payLog = getPayLog(goodsOrder.getId());
            AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());

            WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder()
                    .notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/buyout/" + AppContext.getApp())
                    .openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId())
                    .body("支付一口价订单")
                    .spbillCreateIp("127.0.0.1")
                    .totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue())
                    .detail(Arrays.stream(postOrderVO.getGoodsList()).map(GoodsVO::getTitle).collect(Collectors.joining(";")))
                    .build();
            WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
            redissonLockClient.unlock(lock);
            return Result.OK("", wxPayService.createOrder(request));
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
    /**
     * 出价拍品
     *
     * @return
     */
    @PostMapping("/offers")
    public Result<?> goodsOffer(@RequestBody JSONObject post) {
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
        if (performance != null) {
            LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsDeposit::getPerformanceId, performance.getId());
            queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
            if (goodsDepositService.count(queryWrapper) == 0) {
                return Result.error("未缴纳专场保证金");
            }
        } else if (goods.getDeposit() > 0) {
            LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsDeposit::getGoodsId, goods.getId());
            queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
            if (goodsDepositService.count(queryWrapper) == 0) {
                return Result.error("未缴纳保证金");
            }
        }
        return auctionGoodsService.offer(post);
    }

    /**
     * 缴纳专场保证金
     * @param id
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PostMapping("/deposits/performance")
    @Transactional
    public Result<?> payPerformanceDeposit(@RequestParam("id") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到专场");
        }
        Performance performance = performanceService.getById(id);
        if (performance == null) {
            throw new JeecgBootException("操作失败找不到专场");
        }
        if (performance.getDeposit() == null || performance.getDeposit() <= 0) {
            throw new JeecgBootException("该拍品无需缴纳保证金");
        }
        //专场结束不能缴纳保证金
        if((performance.getType() == 1 && performance.getEndTime().before(new Date())) || (performance.getType() == 2 && performance.getState() > 1)) {
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

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder()
                .notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/deposit/" + AppContext.getApp())
                .openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId())
                .body("支付专场保证金:")
                .spbillCreateIp("127.0.0.1")
                .totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue())
                .detail(performance.getTitle())
                .build();
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
    @Transactional
    public Result<?> payGoodsDeposit(@RequestParam("id") String id) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        Goods goods = goodsService.getById(id);
        if (goods == null) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        if (goods.getDeposit() == null || goods.getDeposit() <= 0) {
            throw new JeecgBootException("该拍品无需缴纳保证金");
        }
        Performance performance = performanceService.getById(goods.getPerformanceId());
        if(performance != null) {
            //专场结束不能缴纳保证金
            if((performance.getType() == 1 && performance.getEndTime().before(new Date())) || (performance.getType() == 2 && performance.getState() > 1)) {
                throw new JeecgBootException("专场已结束无法缴纳保证金");
            }
        }
        //验证拍品是否结束
        Date endTime = goods.getActualEndTime() != null ? goods.getActualEndTime() : goods.getEndTime();
        if(goods.getState() > 1 || (endTime != null && endTime.before(new Date()))) {
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
        goodsDeposit.setPrice(goods.getDeposit());
        goodsDeposit.setStatus(0);
        boolean result = goodsDepositService.save(goodsDeposit);
        if (!result) {
            throw new JeecgBootException("支付失败");
        }
        PayLog payLog = getPayLog(goodsDeposit.getId());
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        BigDecimal payAmount = BigDecimal.valueOf(deposit).setScale(2, RoundingMode.HALF_DOWN);

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder()
                .notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/paimai/api/notify/deposit/" + AppContext.getApp())
                .openid(appMemberVO.getWxappOpenid()).outTradeNo(payLog.getId())
                .body("支付拍品保证金:")
                .spbillCreateIp("127.0.0.1")
                .totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue())
                .detail(goods.getTitle())
                .build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
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
