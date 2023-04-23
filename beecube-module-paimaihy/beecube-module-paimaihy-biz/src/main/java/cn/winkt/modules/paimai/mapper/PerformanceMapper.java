package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.vo.GoodsVO;
import cn.winkt.modules.paimai.vo.PerformanceVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.paimai.entity.Performance;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface PerformanceMapper extends BaseMapper<Performance> {
    PerformanceVO getDetail(@Param("id") String id);

    IPage<PerformanceVO> selectPageVO(Page<PerformanceVO> page, @Param(Constants.WRAPPER) QueryWrapper<PerformanceVO> queryWrapper);
    List<PerformanceVO> selectListVO(@Param(Constants.WRAPPER) QueryWrapper<PerformanceVO> queryWrapper);
}
