package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.Coupon;
import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.mapper.CouponMapper;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.boot.starter.lock.annotation.JLock;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;

@Service
public class CouponGrantService {
    @Resource
    private CouponMapper couponMapper;

    @Resource
    private AppApi appApi;

    @Resource
    private ICouponTicketService ticketService;

    @Transactional(rollbackFor = Exception.class)
    @JLock(lockKey = "COUPON-GRANT-LOCK")
    public void grantTicketToMember(String couponId, String memberId) {
        Coupon coupon = couponMapper.selectById(couponId);
        AppMemberVO appMemberVO = appApi.getMemberById(memberId);
        //检测数量
        if(coupon.getMaxCount() <= coupon.getTakedCount()) {
            return;
        }
        LambdaQueryWrapper<CouponTicket> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CouponTicket::getCouponId, couponId);
        queryWrapper.eq(CouponTicket::getMemberId, memberId);
        if(ticketService.count(queryWrapper) >= coupon.getPerCount()) {
            return;
        }

        CouponTicket ticket = new CouponTicket();
        ticket.setCouponId(couponId);
        ticket.setCouponTitle(coupon.getTitle());
        ticket.setMemberId(memberId);
        ticket.setMemberName(StringUtils.getIfEmpty(appMemberVO.getNickname(), appMemberVO::getPhone));
        ticket.setMemberAvatar(appMemberVO.getAvatar());
        ticket.setCreateTime(new Date());
        ticket.setStartTime(DateUtils.addDays(new Date(), coupon.getStartDays()));
        ticket.setEndTime(DateUtils.addDays(new Date(), coupon.getEndDays()));
        ticket.setStatus(0);
        ticketService.save(ticket);

        coupon.setTakedCount(coupon.getTakedCount()+1);
        couponMapper.updateById(coupon);
    }
}
