package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class AppMenu {
    private String icon;
    private String component;
    private String name;
    private Boolean hidden;
    private Integer menuType;
    private Integer sortNo;
    private String title;
    private Boolean internalOrExternal;
    private String url;
    private AppMenu[] children;
}
