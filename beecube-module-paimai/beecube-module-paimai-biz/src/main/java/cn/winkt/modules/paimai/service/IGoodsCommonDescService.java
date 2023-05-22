package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.vo.GoodsSettings;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 拍品公共信息表
 * @Author: jeecg-boot
 * @Date:   2023-02-09
 * @Version: V1.0
 */
public interface IGoodsCommonDescService extends IService<GoodsCommonDesc> {

    GoodsSettings queryGoodsSettings();
}
