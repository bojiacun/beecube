package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.mapper.GoodsOrderMapper;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
import cn.winkt.modules.paimai.vo.OrderVo;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class GoodsOrderServiceImpl extends ServiceImpl<GoodsOrderMapper, GoodsOrder> implements IGoodsOrderService {

}
