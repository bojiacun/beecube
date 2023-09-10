package cn.winkt.modules.paimai.mapper;

import java.util.List;

import cn.winkt.modules.paimai.vo.LiveRoomVo;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.paimai.entity.LiveRoom;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 直播间表
 * @Author: jeecg-boot
 * @Date:   2023-04-04
 * @Version: V1.0
 */
public interface LiveRoomMapper extends BaseMapper<LiveRoom> {
    void updateRoomViews(@Param("id") String id);

    LiveRoomVo getDetail(@Param("id") String id);
}
