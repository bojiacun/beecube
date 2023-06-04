package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Coupon;
import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.mapper.CouponMapper;
import cn.winkt.modules.paimai.mapper.CouponTicketMapper;
import cn.winkt.modules.paimai.mapper.GoodsMapper;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.*;

/**
 * @Description: 优惠券票据
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Service
public class CouponTicketServiceImpl extends ServiceImpl<CouponTicketMapper, CouponTicket> implements ICouponTicketService {

    @Resource
    private CouponTicketMapper couponTicketMapper;

    @Resource
    private CouponMapper couponMapper;

    @Resource
    private GoodsMapper goodsMapper;

    @Override
    public Map<String, List<CouponTicket>> getAvailableTickets(List<GoodsVO> goodsList) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<CouponTicket> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("member_id", loginUser.getId());
        queryWrapper.eq("status", 0);
        queryWrapper.gt("end_time", new Date());
        queryWrapper.lt("start_time", new Date());
        Map<String, List<CouponTicket>> userTickets = new HashMap<>();
        List<CouponTicket> available = new ArrayList<>();
        List<CouponTicket> unAvailable = new ArrayList<>();

        couponTicketMapper.selectList(queryWrapper).forEach(couponTicket -> {
            Coupon coupon = couponMapper.selectById(couponTicket.getCouponId());
            if(coupon == null) {
                unAvailable.add(couponTicket);
            }
            else {
                boolean isValid = false;
                BigDecimal totalPrice = BigDecimal.ZERO;
                for (GoodsVO goodsVO: goodsList) {
                    if(coupon.getRuleGoods() == 1 && StringUtils.isNotEmpty(coupon.getRuleGoodsClassIds()) && ArrayUtils.indexOf(coupon.getRuleGoodsClassIds().split(","), goodsVO.getClassId()) >= 0 ) {
                        isValid = true;
                    }
                    else if(coupon.getRuleGoods() == 2 && StringUtils.isNotEmpty(coupon.getRuleGoodsIds()) && ArrayUtils.indexOf(coupon.getRuleGoodsIds().split(","), goodsVO.getId()) >= 0) {
                        isValid = true;
                    }
                    else if(coupon.getRuleGoods() == 3) {
                        isValid = true;
                    }
                    totalPrice = totalPrice.add(goodsVO.getStartPrice().multiply(BigDecimal.valueOf(goodsVO.getCount())));
                }
                //计算订单总价是否满足优惠券的满减规则
                if(totalPrice.compareTo(coupon.getMinPrice()) < 0) {
                    isValid = false;
                }

                if(isValid) {
                    available.add(couponTicket);
                }
                else {
                    unAvailable.add(couponTicket);
                }
            }
            couponTicket.setCoupon(coupon);
        });


        userTickets.put("available", available);
        userTickets.put("unAvailable", unAvailable);
        return userTickets;
    }

    @Override
    public boolean canTicketUseful(String ticketId, List<GoodsVO> goodsList) {
        Map<String, List<CouponTicket>> coupons = getAvailableTickets(goodsList);
        List<CouponTicket> available = coupons.get("available");
        boolean canUse = false;
        for (CouponTicket ticket :available) {
            if(Objects.equals(ticket.getId(), ticketId)) {
                canUse = true;
                break;
            }
        }
        return canUse;
    }

    @Override
    public void reset(CouponTicket ticket) {
        couponTicketMapper.resetTicket(ticket.getId());
    }
}
