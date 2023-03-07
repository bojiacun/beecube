package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.vo.OrderVo;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface GoodsOrderMapper extends BaseMapper<GoodsOrder> {
}
