package cn.winkt.modules.paimai.service;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.entity.OrderGoods;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Slf4j
public class CommissionService {
    @Resource
    AppApi appApi;

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsService goodsService;

    public void dispatchComission(GoodsOrder goodsOrder) {
        if(goodsOrder.getType() != 2) {
            return;
        }
        try {
            AppMemberVO buyer = appApi.getMemberById(goodsOrder.getMemberId());
            if (buyer != null && StringUtils.isNotEmpty(buyer.getShareId())) {
                AppMemberVO sharer = appApi.getMemberById(buyer.getShareId());
                if(sharer != null && sharer.getIsAgent() == 1) {
                    //是分销商，则给分销商返点
                    BigDecimal amount = BigDecimal.ZERO;
                    LambdaQueryWrapper<OrderGoods> queryWrapper = new LambdaQueryWrapper<>();
                    queryWrapper.eq(OrderGoods::getOrderId, goodsOrder.getId());
                    List<OrderGoods> orderGoodsList = orderGoodsService.list(queryWrapper);
                    for (OrderGoods orderGoods : orderGoodsList) {
                        Goods goods = goodsService.getById(orderGoods.getGoodsId());
                        if(goods.getCommission() != null) {
                            //计算分佣返点
                            BigDecimal goodsTotalPrice = orderGoods.getGoodsPrice().multiply(BigDecimal.valueOf(orderGoods.getGoodsCount()));
                            amount = amount.add(BigDecimal.valueOf(goods.getCommission()).multiply(goodsTotalPrice).divide(BigDecimal.valueOf(100), 4, RoundingMode.CEILING)).setScale(2, RoundingMode.CEILING);
                        }
                    }
                    if(amount.floatValue()>0) {
                        appApi.addMemberMoney(sharer.getId(), String.format("分销返佣, 单号为 %s", goodsOrder.getId()), amount.floatValue());
                    }
                }
            }
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
