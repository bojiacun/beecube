package cn.winkt.modules.paimai.service.im.message;

import cn.winkt.modules.paimai.entity.LiveRoomStream;
import lombok.Data;

import java.util.List;

@Data
public class RoomStreamChangedMessage extends BaseMessage{

    List<LiveRoomStream> newStreams;
}
