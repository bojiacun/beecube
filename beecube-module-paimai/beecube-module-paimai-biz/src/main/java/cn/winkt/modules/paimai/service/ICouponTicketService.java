package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.CouponTicket;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * @Description: 优惠券票据
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
public interface ICouponTicketService extends IService<CouponTicket> {

    /**
     * 获取对应商品的用户优惠券
     * @param goodsIds
     * @return
     */
    Map<String, List<CouponTicket>> getAvailableTickets(List<String> goodsIds);
}
