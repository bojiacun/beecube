package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.vo.GoodsVO;
import cn.winkt.modules.paimai.vo.PerformanceVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface IPerformanceService extends IService<Performance> {
    PerformanceVO getDetail(String id);
    IPage<PerformanceVO> selectPageVO(Page<PerformanceVO> page, QueryWrapper<PerformanceVO> queryWrapper);
}
