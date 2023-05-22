package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.CouponTicket;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * @Description: 优惠券票据
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
public interface ICouponTicketService extends IService<CouponTicket> {

    List<CouponTicket> getAvailableTickets(List<String> goodsIds);
}
