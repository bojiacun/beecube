package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.vo.GoodsVO;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.paimai.entity.Goods;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 拍品表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface GoodsMapper extends BaseMapper<Goods> {

    GoodsVO getDetail(@Param("id") String id);
}
