package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.ChangeMemberScore;
import cn.winkt.modules.app.vo.MemberSetting;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.Coupon;
import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.mapper.GoodsOrderMapper;
import cn.winkt.modules.paimai.service.ICouponService;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
import cn.winkt.modules.paimai.vo.GoodsSettings;
import cn.winkt.modules.paimai.vo.OrderVo;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
@Slf4j
public class GoodsOrderServiceImpl extends ServiceImpl<GoodsOrderMapper, GoodsOrder> implements IGoodsOrderService {

    @Resource
    GoodsOrderMapper goodsOrderMapper;

    @Resource
    MiniappServices miniappServices;

    @Resource
    AppApi appApi;

    @Resource
    private IGoodsCommonDescService goodsCommonDescService;

    @Resource
    private ICouponTicketService couponTicketService;

    @Resource
    private ICouponService couponService;



    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(GoodsOrder goodsOrder) throws InvocationTargetException, IllegalAccessException, WxPayException {
        if (goodsOrder.getStatus() != 1 && goodsOrder.getStatus() != 0) {
            throw new JeecgBootException("订单状态异常，无法取消");
        }
        //原路退款
        if (goodsOrder.getTransactionId() != null) {
            Integer refundAmount = BigDecimal.valueOf(goodsOrder.getPayedPrice()).setScale(2, RoundingMode.HALF_DOWN).multiply(BigDecimal.valueOf(100)).intValue();
            log.debug("原路返回支付金额 {}", refundAmount);
            WxPayRefundRequest refundRequest = WxPayRefundRequest.newBuilder().transactionId(goodsOrder.getTransactionId()).outRefundNo(goodsOrder.getId()).totalFee(refundAmount).refundFee(refundAmount).build();
            WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
            WxPayRefundResult result = wxPayService.refund(refundRequest);
            if (!"SUCCESS".equals(result.getReturnCode()) || !"SUCCESS".equals(result.getResultCode())) {
                throw new JeecgBootException("退款失败");
            }
        }
        //返还积分
        if(goodsOrder.getUsedIntegral() != null && goodsOrder.getUsedIntegral().compareTo(BigDecimal.ZERO) > 0) {
            GoodsSettings goodsSettings = goodsCommonDescService.queryGoodsSettings();
            ChangeMemberScore changeMemberScore = new ChangeMemberScore();
            changeMemberScore.setMemberId(goodsOrder.getMemberId());
            changeMemberScore.setDescription("取消订单，返还积分");
            changeMemberScore.setAmount(goodsOrder.getUsedIntegral());
            appApi.reduceMemberScore(changeMemberScore);
        }
        //返还优惠券
        if(goodsOrder.getUsedCouponTicketId() != null) {
            CouponTicket couponTicket = couponTicketService.getById(goodsOrder.getUsedCouponTicketId());
            if(couponTicket != null) {
                Coupon coupon = couponService.getById(couponTicket.getCouponId());
                if(coupon != null) {
                    couponTicketService.reset(couponTicket);
                }
            }
        }
        goodsOrder.setStatus(-1);
        goodsOrderMapper.updateById(goodsOrder);
    }

    @Override
    public GoodsOrder getLatestOrder(String memberId, Integer type) {
        return goodsOrderMapper.getLatestOrder(memberId, type);
    }
}
