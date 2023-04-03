package cn.winkt.modules.app.vo;

import lombok.Data;
import java.util.List;

@Data
public class WxAppExtJsonConfig {
    private WxAppExtConfig ext;
    private Boolean extEnable;
    private String extAppid;
    private Boolean directCommit;
    private List<String> requiredPrivateInfos;
}
