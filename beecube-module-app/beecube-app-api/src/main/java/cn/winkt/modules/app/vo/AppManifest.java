package cn.winkt.modules.app.vo;

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
}
