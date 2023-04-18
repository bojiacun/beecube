package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.entity.GoodsOrderAfter;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.service.IGoodsOrderAfterService;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IOrderGoodsService;
import cn.winkt.modules.paimai.vo.GoodsOrderAfterVO;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RequestMapping("/api/orders")
@RestController
@Slf4j
public class WxAppOrderController {

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    IGoodsService goodsService;


    @Resource
    IGoodsOrderService goodsOrderService;


    @Resource
    IGoodsOrderAfterService goodsOrderAfterService;

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
     * 获取订单售后订单
     * @param id
     * @return
     */
    @GetMapping("/afters")
    public Result<List<GoodsOrderAfterVO>> orderAfters(@RequestParam String id) {
        QueryWrapper<GoodsOrderAfter> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("oa.order_id", id);
        return Result.OK(goodsOrderAfterService.selectListVO(queryWrapper));
    }

    /**
     * 取消订单
     * @param id
     * @return
     */
    @PutMapping("/cancel_after")
    @Transactional(rollbackFor = Exception.class)
    public Result<Boolean> cancelAfter(@RequestParam String id) {
        GoodsOrderAfter goodsOrderAfter = goodsOrderAfterService.getById(id);
        goodsOrderAfterService.removeById(id);
        //更新订单状态
        LambdaQueryWrapper<GoodsOrderAfter> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOrderAfter::getOrderId, goodsOrderAfter.getOrderId());

        if(goodsOrderAfterService.count(queryWrapper) == 0) {
            GoodsOrder goodsOrder = goodsOrderService.getById(goodsOrderAfter.getOrderId());
            goodsOrder.setStatus(3);
            goodsOrderService.updateById(goodsOrder);
        }

        return Result.OK(true);
    }

    /**
     * 申请售后
     * @param post
     * @return
     */
    @PostMapping("/afters")
    @Transactional(rollbackFor = Exception.class)
    public Result<Boolean> newAfterOrder(@RequestBody JSONObject post) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        String orderId = post.getString("orderId");
        String orderGoodsId = post.getString("orderGoodsId");
        String description = post.getString("description");
        OrderGoods orderGoods = orderGoodsService.getById(orderGoodsId);
        GoodsOrder goodsOrder = goodsOrderService.getById(orderId);
        if(StringUtils.isEmpty(description)) {
            throw new JeecgBootException("请填写备注信息");
        }
        if(orderGoods.getIsAfter() == 1) {
            throw new JeecgBootException("该商品已经申请售后，请耐心等待客服处理");
        }
        orderGoods.setIsAfter(1);
        goodsOrder.setStatus(4);
        orderGoodsService.updateById(orderGoods);
        goodsOrderService.updateById(goodsOrder);

        GoodsOrderAfter goodsOrderAfter = new GoodsOrderAfter();
        goodsOrderAfter.setOrderId(orderId);
        goodsOrderAfter.setOrderGoodsId(orderGoodsId);
        goodsOrderAfter.setStatus(0);
        goodsOrderAfter.setType(post.getInteger("type"));
        goodsOrderAfter.setDescription(description);
        goodsOrderAfter.setMemberAvatar(loginUser.getAvatar());
        goodsOrderAfter.setMemberName(StringUtils.getIfEmpty(loginUser.getRealname(), loginUser::getNickname));
        goodsOrderAfter.setMemberId(loginUser.getId());

        goodsOrderAfterService.save(goodsOrderAfter);

        return Result.OK(true);
    }
}
