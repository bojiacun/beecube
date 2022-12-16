package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class AppMenu {
    private String id;
    private String parentId;
    private String icon;
    private String component;
    private String componentName;
    private String perms;
    private String permsType;
    private String name;
    private Boolean hidden = false;
    private Integer menuType = 0;
    private Integer sortNo = 1;
    private String title;
    private Boolean internalOrExternal = false;
    private Boolean leaf = false;
    private Boolean route = true;
    private Boolean status = true;
    private String url;
    private AppMenu[] children;
}
