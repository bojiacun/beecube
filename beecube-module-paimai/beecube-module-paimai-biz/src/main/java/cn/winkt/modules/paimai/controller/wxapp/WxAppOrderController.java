package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IOrderGoodsService;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RequestMapping("/paimai/api/orders")
@RestController
@Slf4j
public class WxAppOrderController {

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsService goodsService;


    @Resource
    IGoodsOrderService goodsOrderService;

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
     * 申请售后
     * @param post
     * @return
     */
    @PostMapping("/afters")
    @Transactional
    public Result<Boolean> newAfterOrder(@RequestBody JSONObject post) {
        String orderId = post.getString("orderId");
        String orderGoodsId = post.getString("orderGoodsId");
        String description = post.getString("description");
        OrderGoods orderGoods = orderGoodsService.getById(orderGoodsId);
        GoodsOrder goodsOrder = goodsOrderService.getById(orderId);
        if(StringUtils.isEmpty(description)) {
            throw new JeecgBootException("请填写备注信息");
        }
        orderGoods.setIsAfter(1);
        goodsOrder.setStatus(4);
        orderGoodsService.updateById(orderGoods);
        goodsOrderService.updateById(goodsOrder);
        return Result.OK(true);
    }
}
