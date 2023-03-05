package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.mapper.PerformanceMapper;
import cn.winkt.modules.paimai.service.IPerformanceService;
import cn.winkt.modules.paimai.vo.PerformanceVO;
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
public class PerformanceServiceImpl extends ServiceImpl<PerformanceMapper, Performance> implements IPerformanceService {

    @Resource
    PerformanceMapper performanceMapper;
    @Override
    public PerformanceVO getDetail(String id) {
        return performanceMapper.getDetail(id);
    }

    @Override
    public IPage<PerformanceVO> selectPageVO(Page<PerformanceVO> page, QueryWrapper<PerformanceVO> queryWrapper) {
        return performanceMapper.selectPageVO(page, queryWrapper);
    }

    @Override
    public List<PerformanceVO> selectListVO(QueryWrapper<PerformanceVO> queryWrapper) {
        return performanceMapper.selectListVO(queryWrapper);
    }
}
