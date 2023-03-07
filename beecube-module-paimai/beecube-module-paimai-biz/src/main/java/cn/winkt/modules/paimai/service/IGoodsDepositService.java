package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.vo.GoodsDepositVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import org.apache.ibatis.annotations.Param;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface IGoodsDepositService extends IService<GoodsDeposit> {
    IPage<GoodsDepositVO> selectPageVO(Page<GoodsDeposit> page, @Param(Constants.WRAPPER) QueryWrapper<GoodsDeposit> queryWrapper);
}
