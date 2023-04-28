package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.mapper.GoodsMapper;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import org.apache.ibatis.annotations.Param;
import org.jeecg.common.system.vo.LoginUser;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description: 拍品表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface IGoodsService extends IService<Goods> {
    GoodsVO getDetail(String id);
    Integer calcGoodsSales(String goodsId);
    IPage<GoodsVO> selectPageVO(Page<Goods> page, QueryWrapper<Goods> queryWrapper);
    List<GoodsVO> selectListVO(QueryWrapper<Goods> queryWrapper);
    IPage<Goods> queryMemberViewGoods(String member_id, Page<Goods> page);
    IPage<Goods> queryMemberFollowGoods(String member_id, Page<Goods> page);


    boolean isStarted(Goods goods);
    boolean isStarted(String goodsId);
    boolean isEnded(String goodsId);
    boolean isEnded(Goods goods);

    boolean checkDeposite(LoginUser loginUser, Goods goods);
    boolean checkDeposite(LoginUser loginUser, String goodsId);
}
