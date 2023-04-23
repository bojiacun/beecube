package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.mapper.GoodsDepositMapper;
import cn.winkt.modules.paimai.service.IGoodsDepositService;
import cn.winkt.modules.paimai.vo.GoodsDepositVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class GoodsDepositServiceImpl extends ServiceImpl<GoodsDepositMapper, GoodsDeposit> implements IGoodsDepositService {

    @Resource
    GoodsDepositMapper goodsDepositMapper;
    @Override
    public IPage<GoodsDepositVO> selectPageVO(Page<GoodsDeposit> page, QueryWrapper<GoodsDeposit> queryWrapper) {
        return goodsDepositMapper.selectPageVO(page, queryWrapper);
    }
}
