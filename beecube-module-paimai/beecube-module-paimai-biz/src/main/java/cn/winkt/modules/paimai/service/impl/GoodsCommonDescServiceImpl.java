package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.mapper.GoodsCommonDescMapper;
import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
import cn.winkt.modules.paimai.vo.GoodsSettings;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @Description: 拍品公共信息表
 * @Author: jeecg-boot
 * @Date:   2023-02-09
 * @Version: V1.0
 */
@Service
public class GoodsCommonDescServiceImpl extends ServiceImpl<GoodsCommonDescMapper, GoodsCommonDesc> implements IGoodsCommonDescService {

    @Resource
    private GoodsCommonDescMapper goodsCommonDescMapper;
    @Override
    public GoodsSettings queryGoodsSettings() {
        List<GoodsCommonDesc> descs = goodsCommonDescMapper.selectList(new QueryWrapper<>());
        Map<String, String> map = descs.stream().collect(Collectors.toMap(GoodsCommonDesc::getDescKey, GoodsCommonDesc::getDescValue));
        GoodsSettings goodsSettings = new GoodsSettings();
        BeanUtils.copyProperties(map, goodsSettings);
        return goodsSettings;
    }
}
