package cn.winkt.modules.app.vo;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

@Data
public class AppManifest {
    private AppMenu[] menus;
    private AppGateway gateway;
    private String installUrl;
    private String uninstallUrl;
    private String upgradeUrl;
    private String homeUrl;
    private AppResource resources;
    private AppRole role;
    private String name;
    private String identify;
    private String logo;
    private String author;
    private String version;
    private String supportWechat;
    private String supportDouyin;
    private String supportH5;
    private String description;
}
