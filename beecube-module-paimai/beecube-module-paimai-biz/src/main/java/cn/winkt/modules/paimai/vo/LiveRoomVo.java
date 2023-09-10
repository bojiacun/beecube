package cn.winkt.modules.paimai.vo;

import cn.winkt.modules.paimai.entity.LiveRoom;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class LiveRoomVo extends LiveRoom {
    private Integer goodsCount;
    private Integer offerCount;
    private Integer depositCount;
}
