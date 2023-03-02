package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.GoodsOffer;
import cn.winkt.modules.paimai.mapper.GoodsOfferMapper;
import cn.winkt.modules.paimai.service.IGoodsOfferService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 出价记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class GoodsOfferServiceImpl extends ServiceImpl<GoodsOfferMapper, GoodsOffer> implements IGoodsOfferService {

    @Resource
    GoodsOfferMapper goodsOfferMapper;
    @Override
    public Double getMaxOffer(String goodsId) {
        return goodsOfferMapper.getMaxOffer(goodsId);
    }
}
