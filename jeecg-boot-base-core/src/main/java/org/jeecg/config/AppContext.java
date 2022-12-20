package org.jeecg.config;//package org.jeecg.config.mybatis;

import lombok.extern.slf4j.Slf4j;

/**
 * App 存储器
 * @author: jeecg-boot
 */
@Slf4j
public class AppContext {
    private static ThreadLocal<String> currentApp = new ThreadLocal<>();

    public static void setApp(String appId) {
        log.debug(" setting app to " + appId);
        currentApp.set(appId);
    }

    public static String getApp() {
        return currentApp.get();
    }

    public static void clear(){
        currentApp.remove();
    }
}
