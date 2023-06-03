package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.*;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/orders")
@RestController
@Slf4j
public class WxAppOrderController {

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsService goodsService;
    @Resource
    ICouponTicketService couponTicketService;
    @Resource
    IGoodsOrderService goodsOrderService;

    @Resource
    IGoodsCommonDescService goodsCommonDescService;
    @Resource
    IGoodsOrderAfterService goodsOrderAfterService;

    @Resource
    ICouponService couponService;

    /**
     * 计算订单实际支付费用
     * @param postOrderVO
     * @return
     */
    @PutMapping("/price/calc")
    public Result<?> calcOrderPrice(@RequestBody PostOrderVO postOrderVO) {
        postOrderVO.setDeliveryPrice(BigDecimal.ZERO);
        BigDecimal totalPrice = BigDecimal.ZERO;
        for(GoodsVO orderGoods : postOrderVO.getGoodsList()){
            totalPrice = totalPrice.add(orderGoods.getStartPrice().multiply(BigDecimal.valueOf(orderGoods.getCount())));
        };
        //计算真实价格
        BigDecimal actualPrice = BigDecimal.valueOf(totalPrice.floatValue());
        if(StringUtils.isNotEmpty(postOrderVO.getTicketId())) {
            CouponTicket ticket = couponTicketService.getById(postOrderVO.getTicketId());
            Coupon coupon = couponService.getById(ticket.getCouponId());
            actualPrice = actualPrice.subtract(coupon.getAmount());
            postOrderVO.setTicketAmount(coupon.getAmount());
        }
        if(postOrderVO.getUseIntegral() != null && postOrderVO.getUseIntegral().compareTo(BigDecimal.ZERO) > 0) {
            actualPrice = actualPrice.subtract(postOrderVO.getUseIntegral());
        }
        postOrderVO.setPayedPrice(actualPrice);
        return Result.OK(postOrderVO);
    }

    @PutMapping("/coupons")
    public Result<?> getCouponsByOrder(@RequestBody PostOrderVO postOrderVO) {
        return Result.OK(couponTicketService.getAvailableTickets(Arrays.asList(postOrderVO.getGoodsList())));
    }


    @GetMapping("/badges")
    public Result<?> orderBadges() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        OrderBadge orderBadge = new OrderBadge();

        LambdaQueryWrapper<GoodsOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getStatus, 0);
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        orderBadge.setPayCount(goodsOrderService.count(queryWrapper));

        queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getStatus, 1);
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        orderBadge.setDeliveryCount(goodsOrderService.count(queryWrapper));


        queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsOrder::getStatus, 2);
        orderBadge.setConfirmDeliveryCount(goodsOrderService.count(queryWrapper));


        return Result.OK(orderBadge);
    }

    @PutMapping("/netpay")
    public Result<Boolean> netPay(@RequestBody JSONObject post) {
        String payImage = post.getString("payImage");
        String orderId = post.getString("orderId");
        GoodsOrder goodsOrder = goodsOrderService.getById(orderId);
        if(goodsOrder.getStatus() != 0) {
            throw new JeecgBootException("订单状态异常无法支付");
        }
        goodsOrder.setPayImage(payImage);
        goodsOrderService.updateById(goodsOrder);
        return Result.OK(true);
    }

    /**
     * 售后详情
     * @param id
     * @return
     */
    @GetMapping("/goods/detail")
    public Result<?> orderGoodsDetail(@RequestParam String id) {
        OrderGoods orderGoods = orderGoodsService.getById(id);
        Goods goods = goodsService.getById(orderGoods.getGoodsId());
        return Result.OK(goods);
    }


    /**
     * 获取订单售后订单
     * @param id
     * @return
     */
    @GetMapping("/afters")
    public Result<List<GoodsOrderAfterVO>> orderAfters(@RequestParam String id) {
        QueryWrapper<GoodsOrderAfter> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("oa.order_id", id);
        return Result.OK(goodsOrderAfterService.selectListVO(queryWrapper));
    }

    /**
     * 取消订单
     * @param id
     * @return
     */
    @PutMapping("/cancel_after")
    @Transactional(rollbackFor = Exception.class)
    public Result<Boolean> cancelAfter(@RequestParam String id) {
        GoodsOrderAfter goodsOrderAfter = goodsOrderAfterService.getById(id);
        goodsOrderAfterService.removeById(id);
        //更新订单状态
        LambdaQueryWrapper<GoodsOrderAfter> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrderAfter::getOrderId, goodsOrderAfter.getOrderId());

        if(goodsOrderAfterService.count(queryWrapper) == 0) {
            GoodsOrder goodsOrder = goodsOrderService.getById(goodsOrderAfter.getOrderId());
            goodsOrder.setStatus(3);
            goodsOrderService.updateById(goodsOrder);
        }

        return Result.OK(true);
    }

    /**
     * 申请售后
     * @param post
     * @return
     */
    @PostMapping("/afters")
    @Transactional(rollbackFor = Exception.class)
    public Result<Boolean> newAfterOrder(@RequestBody JSONObject post) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        String orderId = post.getString("orderId");
        String orderGoodsId = post.getString("orderGoodsId");
        String description = post.getString("description");
        OrderGoods orderGoods = orderGoodsService.getById(orderGoodsId);
        GoodsOrder goodsOrder = goodsOrderService.getById(orderId);
        if(StringUtils.isEmpty(description)) {
            throw new JeecgBootException("请填写备注信息");
        }
        if(orderGoods.getIsAfter() == 1) {
            throw new JeecgBootException("该商品已经申请售后，请耐心等待客服处理");
        }
        orderGoods.setIsAfter(1);
        goodsOrder.setStatus(4);
        orderGoodsService.updateById(orderGoods);
        goodsOrderService.updateById(goodsOrder);

        GoodsOrderAfter goodsOrderAfter = new GoodsOrderAfter();
        goodsOrderAfter.setOrderId(orderId);
        goodsOrderAfter.setOrderGoodsId(orderGoodsId);
        goodsOrderAfter.setStatus(0);
        goodsOrderAfter.setType(post.getInteger("type"));
        goodsOrderAfter.setDescription(description);
        goodsOrderAfter.setMemberAvatar(loginUser.getAvatar());
        goodsOrderAfter.setMemberName(StringUtils.getIfEmpty(loginUser.getRealname(), loginUser::getNickname));
        goodsOrderAfter.setMemberId(loginUser.getId());

        goodsOrderAfterService.save(goodsOrderAfter);

        return Result.OK(true);
    }
}
