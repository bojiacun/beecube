package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.vo.GoodsDepositVO;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface GoodsDepositMapper extends BaseMapper<GoodsDeposit> {
    IPage<GoodsDepositVO> selectPageVO(Page<GoodsDeposit> page, @Param(Constants.WRAPPER) QueryWrapper<GoodsDeposit> queryWrapper);
}
