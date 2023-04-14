package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

import java.io.Serializable;

@Data
public class RoomMessage implements Serializable {
    private String roomId;
}
