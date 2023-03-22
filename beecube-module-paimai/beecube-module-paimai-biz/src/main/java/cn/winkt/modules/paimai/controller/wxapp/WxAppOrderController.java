package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IOrderGoodsService;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RequestMapping("/paimai/api/orders")
@RestController
@Slf4j
public class WxAppOrderController {

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsService goodsService;

    @GetMapping("/goods/detail")
    public Result<?> orderGoodsDetail(@RequestParam String id) {
        OrderGoods orderGoods = orderGoodsService.getById(id);
        Goods goods = goodsService.getById(orderGoods.getGoodsId());
        return Result.OK(goods);
    }

}
