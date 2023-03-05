package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.vo.GoodsVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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

    IPage<GoodsVO> selectPageVO(Page<Goods> page, @Param(Constants.WRAPPER) QueryWrapper<Goods> queryWrapper);
    List<GoodsVO> selectListVO(@Param(Constants.WRAPPER) QueryWrapper<Goods> queryWrapper);

    IPage<Goods> queryMemberViewGoods(@Param("member_id") String member_id, Page<Goods> page);

    IPage<Goods> queryMemberFollowGoods(@Param("member_id") String member_id, Page<Goods> page);
}
