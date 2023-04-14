package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;

import java.io.Serializable;

@Data
public class BaseMessage implements Serializable {
    private String appId;
    private String roomId;
}
