package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.GoodsOrderAfter;
import cn.winkt.modules.paimai.mapper.GoodsOrderAfterMapper;
import cn.winkt.modules.paimai.service.IGoodsOrderAfterService;
import cn.winkt.modules.paimai.vo.GoodsOrderAfterVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class GoodsOrderAfterServiceImpl extends ServiceImpl<GoodsOrderAfterMapper, GoodsOrderAfter> implements IGoodsOrderAfterService {

    @Resource
    GoodsOrderAfterMapper goodsOrderAfterMapper;

    @Override
    public IPage<GoodsOrderAfterVO> selectPageVO(Page<GoodsOrderAfter> page, QueryWrapper<GoodsOrderAfter> queryWrapper) {
        return goodsOrderAfterMapper.selectPageVO(page, queryWrapper);
    }

    @Override
    public List<GoodsOrderAfterVO> selectListVO(QueryWrapper<GoodsOrderAfter> queryWrapper) {
        return goodsOrderAfterMapper.selectListVO(queryWrapper);
    }
}
