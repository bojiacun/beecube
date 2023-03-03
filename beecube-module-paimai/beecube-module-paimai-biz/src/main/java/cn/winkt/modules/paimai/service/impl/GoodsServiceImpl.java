package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.mapper.GoodsMapper;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 拍品表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods> implements IGoodsService {

    @Resource
    GoodsMapper goodsMapper;

    @Override
    public GoodsVO getDetail(String id) {
        return goodsMapper.getDetail(id);
    }

    @Override
    public IPage<GoodsVO> selectPage(Page<Goods> page, QueryWrapper<Goods> queryWrapper) {
        return goodsMapper.selectPage(page, queryWrapper);
    }

    @Override
    public IPage<Goods> queryMemberViewGoods(String member_id, Page<Goods> page) {
        return goodsMapper.queryMemberViewGoods(member_id, page);
    }

    @Override
    public IPage<Goods> queryMemberFollowGoods(String member_id, Page<Goods> page) {
        return goodsMapper.queryMemberFollowGoods(member_id, page);
    }
}
