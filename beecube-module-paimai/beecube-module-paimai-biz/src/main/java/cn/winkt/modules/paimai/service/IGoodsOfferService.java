package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.GoodsOffer;
import com.baomidou.mybatisplus.extension.service.IService;
import org.apache.ibatis.annotations.Param;

/**
 * @Description: 出价记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface IGoodsOfferService extends IService<GoodsOffer> {
    Double getMaxOffer(@Param("goods_id") String goodsId);
}
