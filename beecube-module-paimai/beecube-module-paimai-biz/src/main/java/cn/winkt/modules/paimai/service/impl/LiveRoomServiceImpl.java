package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.entity.LiveRoom;
import cn.winkt.modules.paimai.mapper.LiveRoomMapper;
import cn.winkt.modules.paimai.service.IGoodsDepositService;
import cn.winkt.modules.paimai.service.ILiveRoomService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.Date;

/**
 * @Description: 直播间表
 * @Author: jeecg-boot
 * @Date:   2023-04-04
 * @Version: V1.0
 */
@Service
public class LiveRoomServiceImpl extends ServiceImpl<LiveRoomMapper, LiveRoom> implements ILiveRoomService {

    @Resource
    LiveRoomMapper liveRoomMapper;

    @Resource
    IGoodsDepositService goodsDepositService;

    @Override
    public void updateRoomViews(String id) {
        liveRoomMapper.updateRoomViews(id);
    }

    @Override
    public boolean checkDeposite(LoginUser loginUser, LiveRoom liveRoom) {
        if(liveRoom.getDeposit() == null || liveRoom.getDeposit() <= 0) {
            return true;
        }
        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getRoomId, liveRoom.getId());
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        if (goodsDepositService.count(queryWrapper) == 0) {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkDeposite(LoginUser loginUser, String roomId) {
        return checkDeposite(loginUser, getById(roomId));
    }

    @Override
    public boolean isStarted(LiveRoom liveRoom) {
        Date now = new Date();
        return liveRoom.getStartTime().before(now) && liveRoom.getEndTime().after(now);
    }

    @Override
    public boolean isStarted(String roomId) {
        return isStarted(getById(roomId));
    }

    @Override
    public boolean isEnded(String roomId) {
        return isEnded(getById(roomId));
    }

    @Override
    public boolean isEnded(LiveRoom liveRoom) {
        return liveRoom.getEndTime().before(new Date());
    }
}
