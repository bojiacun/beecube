package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.LiveRoom;
import com.baomidou.mybatisplus.extension.service.IService;
import org.apache.ibatis.annotations.Param;

/**
 * @Description: 直播间表
 * @Author: jeecg-boot
 * @Date:   2023-04-04
 * @Version: V1.0
 */
public interface ILiveRoomService extends IService<LiveRoom> {
    void updateRoomViews(String id);
}
