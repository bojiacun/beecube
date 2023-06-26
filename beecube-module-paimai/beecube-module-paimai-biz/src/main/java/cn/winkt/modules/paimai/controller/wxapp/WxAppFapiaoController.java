package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.FapiaoOrder;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.service.IFapiaoOrderService;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
import cn.winkt.modules.paimai.service.IOrderGoodsService;
import cn.winkt.modules.paimai.vo.PostFapiaoOrderVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.models.auth.In;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members/fapiao")
public class WxAppFapiaoController {

    @Resource
    IGoodsOrderService goodsOrderService;

    @Resource
    IOrderGoodsService orderGoodsService;

    @Resource
    AppApi appApi;

    @Resource
    IFapiaoOrderService fapiaoOrderService;

    /**
     * 可开票订单
     * @return
     */
    @GetMapping("/orders")
    public Result<?> kaipiaoOrderList(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                      @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                      @RequestParam Integer status
                                      ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsOrder> goodsOrderLambdaQueryWrapper = new LambdaQueryWrapper<>();
        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getStatus, status);
        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getFapiaoStatus, 0);
        goodsOrderLambdaQueryWrapper.gt(GoodsOrder::getPayedPrice, 0);
        goodsOrderLambdaQueryWrapper.eq(GoodsOrder::getMemberId, loginUser.getId());
        goodsOrderLambdaQueryWrapper.orderByDesc(GoodsOrder::getCreateTime);

        Page<GoodsOrder> page = new Page<>(pageNo, pageSize);
        IPage<GoodsOrder> pageList = goodsOrderService.page(page, goodsOrderLambdaQueryWrapper);
        pageList.getRecords().forEach(goodsOrder -> {
            LambdaQueryWrapper<OrderGoods> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(OrderGoods::getOrderId, goodsOrder.getId());
            goodsOrder.setOrderGoods(orderGoodsService.list(queryWrapper));
        });
        return Result.OK(pageList);
    }

    /**
     * 已开票申请
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping("/history")
    public Result<?> kaipiaoHistoryList(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                      @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<FapiaoOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(FapiaoOrder::getMemberId, loginUser.getId());
        queryWrapper.orderByDesc(FapiaoOrder::getCreateTime);

        Page<FapiaoOrder> page = new Page<>(pageNo, pageSize);
        IPage<FapiaoOrder> pageList = fapiaoOrderService.page(page, queryWrapper);
        return Result.OK(pageList);
    }
    @PostMapping("/create")
    @Transactional(rollbackFor = Exception.class)
    public Result<Boolean> create(@RequestBody PostFapiaoOrderVO postFapiaoOrderVO) {
        //计算订单总价
        if(StringUtils.isEmpty(postFapiaoOrderVO.getOrderIds())) {
            throw new JeecgBootException("请选择要开票的订单");
        }
        FapiaoOrder fapiaoOrder = new FapiaoOrder();
        fapiaoOrder.setTitle(postFapiaoOrderVO.getTitle());
        fapiaoOrder.setTaxCode(postFapiaoOrderVO.getTaxCode());
        fapiaoOrder.setType(postFapiaoOrderVO.getType());
        fapiaoOrder.setDeliveryId(postFapiaoOrderVO.getAddress().getId());
        fapiaoOrder.setDeliveryAddress(postFapiaoOrderVO.getAddress().getAddress());
        fapiaoOrder.setDeliveryPhone(postFapiaoOrderVO.getAddress().getPhone());
        fapiaoOrder.setDeliveryUsername(postFapiaoOrderVO.getAddress().getUsername());
        fapiaoOrder.setDeliveryCity(postFapiaoOrderVO.getAddress().getCity());
        fapiaoOrder.setDeliveryDistrict(postFapiaoOrderVO.getAddress().getDistrict());
        fapiaoOrder.setDeliveryProvince(postFapiaoOrderVO.getAddress().getProvince());
        fapiaoOrder.setDeliveryInfo(String.format("%s %s %s %s %s %s", postFapiaoOrderVO.getAddress().getUsername(), postFapiaoOrderVO.getAddress().getPhone(), postFapiaoOrderVO.getAddress().getProvince(), postFapiaoOrderVO.getAddress().getCity(), postFapiaoOrderVO.getAddress().getDistrict(), postFapiaoOrderVO.getAddress().getAddress()));
        fapiaoOrder.setOrderIds(postFapiaoOrderVO.getOrderIds());

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (String orderId : postFapiaoOrderVO.getOrderIds().split(",")) {
            GoodsOrder goodsOrder = goodsOrderService.getById(orderId);
            if(goodsOrder.getFapiaoStatus() != 0) {
                throw new JeecgBootException("所选订单中已经开票");
            }
            totalPrice = totalPrice.add(BigDecimal.valueOf(goodsOrder.getPayedPrice()));
            goodsOrder.setFapiaoStatus(1);
            goodsOrderService.updateById(goodsOrder);
        }
        fapiaoOrder.setAmount(totalPrice.setScale(2, RoundingMode.CEILING).floatValue());
        fapiaoOrder.setStatus(1);
        fapiaoOrder.setType(postFapiaoOrderVO.getType());

        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMemberVO appMemberVO = appApi.getMemberById(loginUser.getId());
        fapiaoOrder.setMemberId(loginUser.getId());
        fapiaoOrder.setMemberEmail(postFapiaoOrderVO.getEmail());
        fapiaoOrder.setMemberName(StringUtils.getIfEmpty(appMemberVO.getRealname(), appMemberVO::getNickname));
        fapiaoOrder.setMemberAvatar(appMemberVO.getAvatar());

        fapiaoOrderService.save(fapiaoOrder);
        return Result.OK(true);
    }
}
