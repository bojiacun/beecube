package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.mapper.CouponTicketMapper;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.List;

/**
 * @Description: 优惠券票据
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Service
public class CouponTicketServiceImpl extends ServiceImpl<CouponTicketMapper, CouponTicket> implements ICouponTicketService {

    @Override
    public List<CouponTicket> getAvailableTickets(List<String> goodsIds) {
        return null;
    }
}
