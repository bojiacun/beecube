package org.jeecg.config.vo;

import java.util.List;

/**
 * @Description: TODO
 * @author: scott
 * @date: 2022年01月21日 14:23
 */
public class Shiro {
    private String excludeUrls = "";
    private List<String> filters;

    private String unauthorizedUrl;
    private String loginUrl;

    public String getExcludeUrls() {
        return excludeUrls;
    }

    public void setExcludeUrls(String excludeUrls) {
        this.excludeUrls = excludeUrls;
    }

    public List<String> getFilters() {
        return filters;
    }

    public void setFilters(List<String> filters) {
        this.filters = filters;
    }

    public String getUnauthorizedUrl() {
        return unauthorizedUrl;
    }

    public void setUnauthorizedUrl(String unauthorizedUrl) {
        this.unauthorizedUrl = unauthorizedUrl;
    }

    public String getLoginUrl() {
        return loginUrl;
    }

    public void setLoginUrl(String loginUrl) {
        this.loginUrl = loginUrl;
    }
}
