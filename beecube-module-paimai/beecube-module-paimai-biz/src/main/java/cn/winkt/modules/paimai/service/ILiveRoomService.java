package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.LiveRoom;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.vo.LiveRoomVo;
import com.baomidou.mybatisplus.extension.service.IService;
import org.apache.ibatis.annotations.Param;
import org.jeecg.common.system.vo.LoginUser;

/**
 * @Description: 直播间表
 * @Author: jeecg-boot
 * @Date:   2023-04-04
 * @Version: V1.0
 */
public interface ILiveRoomService extends IService<LiveRoom> {
    void updateRoomViews(String id);

    boolean checkDeposite(LoginUser loginUser, LiveRoom liveRoom);
    boolean checkDeposite(LoginUser loginUser, String roomId);


    boolean isStarted(LiveRoom liveRoom);
    boolean isStarted(String roomId);
    boolean isEnded(String roomId);
    boolean isEnded(LiveRoom liveRoom);

    LiveRoomVo getDetail(String id);
}
