package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Coupon;
import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.mapper.CouponMapper;
import cn.winkt.modules.paimai.mapper.CouponTicketMapper;
import cn.winkt.modules.paimai.mapper.GoodsMapper;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
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
    public Map<String, List<CouponTicket>> getAvailableTickets(List<String> goodsIds) {
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
                for (String goodsId : goodsIds) {
                    Goods goods = goodsMapper.selectById(goodsId);
                    if (Objects.equals(goods.getClassId(), coupon.getRuleGoodsClassId())) {
                        isValid = true;
                    }
                    else if(Objects.equals(goods.getId(), coupon.getRuleGoodsId())) {
                        isValid = true;
                    }
                    else if(coupon.getRuleGoods() == 3) {
                        isValid = true;
                    }
                }
                if(isValid) {
                    available.add(couponTicket);
                }
                else {
                    unAvailable.add(couponTicket);
                }
            }
        });


        userTickets.put("available", available);
        userTickets.put("unAvailable", unAvailable);
        return userTickets;
    }
}
