package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.vo.GoodsDepositVO;
import cn.winkt.modules.paimai.vo.GoodsOfferVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.paimai.entity.GoodsOffer;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 出价记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface GoodsOfferMapper extends BaseMapper<GoodsOffer> {

    Double getMaxOffer(@Param("goods_id") String goodsId);

    IPage<GoodsOfferVO> selectPageVO(Page<GoodsOffer> page, @Param(Constants.WRAPPER) QueryWrapper<GoodsOffer> queryWrapper);
}
