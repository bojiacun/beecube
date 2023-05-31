package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.vo.OrderVo;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.binarywang.wxpay.exception.WxPayException;

import java.lang.reflect.InvocationTargetException;

/**
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface IGoodsOrderService extends IService<GoodsOrder> {
    /**
     * 取消订单，退还优惠券及使用的积分
     * @param goodsOrder
     */
    void cancel(GoodsOrder goodsOrder) throws InvocationTargetException, IllegalAccessException, WxPayException;
}
