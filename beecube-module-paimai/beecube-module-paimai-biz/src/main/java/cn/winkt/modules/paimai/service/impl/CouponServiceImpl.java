package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.Coupon;
import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.mapper.CouponMapper;
import cn.winkt.modules.paimai.service.ICouponService;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.config.AppContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Description: 优惠券
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements ICouponService {

    @Resource
    private CouponMapper couponMapper;

    @Resource
    private AppApi appApi;

    @Resource
    private CouponGrantService grantService;

    @Override
    @Async
    public void grantTickets(String couponId, String appId) {
        AppContext.setApp(appId);
        Coupon coupon = couponMapper.selectById(couponId);
        //找出合适的会员来
        Integer ruleMember = coupon.getRuleMember();
        List<AppMemberVO> members = appApi.findMembersByType(ruleMember);
        members.forEach(appMemberVO -> {
            grantService.grantTicketToMember(couponId, appMemberVO.getId());
        });
    }
}
