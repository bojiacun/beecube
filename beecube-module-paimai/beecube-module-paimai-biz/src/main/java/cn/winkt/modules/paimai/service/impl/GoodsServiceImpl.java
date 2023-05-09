package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.common.PaimaiConstant;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.entity.LiveRoom;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.mapper.GoodsMapper;
import cn.winkt.modules.paimai.service.IGoodsDepositService;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.ILiveRoomService;
import cn.winkt.modules.paimai.service.IPerformanceService;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Description: 拍品表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods> implements IGoodsService {

    @Resource
    GoodsMapper goodsMapper;

    @Resource
    IPerformanceService performanceService;

    @Resource
    IGoodsDepositService goodsDepositService;

    @Resource
    ILiveRoomService liveRoomService;

    @Override
    public GoodsVO getDetail(String id) {
        return goodsMapper.getDetail(id);
    }

    @Override
    public Integer calcGoodsSales(String goodsId) {
        return goodsMapper.calcGoodsSales(goodsId);
    }

    @Override
    public IPage<GoodsVO> selectPageVO(Page<Goods> page, QueryWrapper<Goods> queryWrapper) {
        return goodsMapper.selectPageVO(page, queryWrapper);
    }

    @Override
    public List<GoodsVO> selectListVO(QueryWrapper<Goods> queryWrapper) {
        return goodsMapper.selectListVO(queryWrapper);
    }

    @Override
    public IPage<Goods> queryMemberViewGoods(String member_id, Page<Goods> page) {
        return goodsMapper.queryMemberViewGoods(member_id, page);
    }

    @Override
    public IPage<Goods> queryMemberFollowGoods(String member_id, Page<Goods> page) {
        return goodsMapper.queryMemberFollowGoods(member_id, page);
    }

    /**
     * 判断拍品是否已经开始竞拍
     * @return
     */
    public boolean isStarted(Goods goods) {
        String performanceId = goods.getPerformanceId();
        String roomId = goods.getRoomId();
        Date now = new Date();
        if(StringUtils.isEmpty(performanceId) && StringUtils.isEmpty(roomId)) {
            //如果是独立拍品, 则看拍品本身是否已经开始
            return now.after(goods.getStartTime());
        }
        else if(StringUtils.isNotEmpty(performanceId)){
            //如果是专场，必须是专场开始了，并且拍品也开始了
            Performance performance = performanceService.getById(performanceId);
            return performanceService.isStarted(performance);
        }
        else if(StringUtils.isNotEmpty(roomId)) {
            LiveRoom room = liveRoomService.getById(roomId);
            return liveRoomService.isStarted(room);
        }
        return false;
    }

    public boolean isStarted(String goodsId) {
        return isStarted(getById(goodsId));
    }

    public boolean isEnded(Goods goods) {
        String performanceId = goods.getPerformanceId();
        String roomId = goods.getRoomId();
        Date now = new Date();
        if(StringUtils.isEmpty(performanceId) && StringUtils.isEmpty(roomId)) {
            //如果是独立拍品, 则看拍品本身是否已经结束
            Date endTime = goods.getActualEndTime() != null ? goods.getActualEndTime() : goods.getEndTime();
            return now.after(endTime);
        }
        else if(StringUtils.isNotEmpty(performanceId)){
            //如果是专场，专场结束了，拍品也自然结束
            Performance performance = performanceService.getById(performanceId);
            return performanceService.isEnded(performance);
        }
        else if(StringUtils.isNotEmpty(roomId)) {
            LiveRoom room = liveRoomService.getById(roomId);
            return liveRoomService.isEnded(room);
        }
        return false;
    }

    @Override
    public boolean checkDeposite(LoginUser loginUser, Goods goods) {
        String performanceId = goods.getPerformanceId();
        String roomId = goods.getRoomId();
        if(StringUtils.isNotEmpty(performanceId)) {
            //拍品所在专场缴纳了保证金即可
            return performanceService.checkDeposite(loginUser, performanceId);
        }
        else if(StringUtils.isNotEmpty(roomId)) {
            return liveRoomService.checkDeposite(loginUser, roomId);
        }
        else {
            if(goods.getDeposit() == null || goods.getDeposit() <= 0){
                return true;
            }
            LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsDeposit::getGoodsId, goods.getId());
            queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
            queryWrapper.eq(GoodsDeposit::getStatus, 1);
            if (goodsDepositService.count(queryWrapper) == 0) {
                return false;
            }
            return true;
        }
    }

    @Override
    public boolean checkDeposite(LoginUser loginUser, String goodsId) {
        return checkDeposite(loginUser, getById(goodsId));
    }

    public boolean isEnded(String goodsId) {
        return isEnded(getById(goodsId));
    }
}
