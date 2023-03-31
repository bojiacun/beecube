package cn.winkt.modules.app.config;


import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.winkt.modules.app.entity.AppWxOpenConfig;
import cn.winkt.modules.app.service.IAppWxOpenConfigService;
import cn.winkt.modules.app.vo.WxOpenConfigInfo;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import me.chanjar.weixin.open.api.WxOpenConfigStorage;
import me.chanjar.weixin.open.api.WxOpenMaService;
import me.chanjar.weixin.open.api.impl.WxOpenInMemoryConfigStorage;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MiniAppOpenService {

    @Resource
    IAppWxOpenConfigService appWxOpenConfigService;


    private static WxOpenConfigStorage wxOpenConfigStorage;


    public WxOpenMaService wxOpenMaService() {
        return null;
    }

    public WxOpenComponentService getWxOpenComponentService() {
        return null;
    }

    public WxOpenConfigStorage getWxOpenConfigStorage() throws InvocationTargetException, IllegalAccessException {
        if(wxOpenConfigStorage == null) {
            wxOpenConfigStorage = new WxOpenInMemoryConfigStorage();
            List<AppWxOpenConfig> configs = appWxOpenConfigService.list();
            Map<String, String> configMap = configs.stream().collect(Collectors.toMap(AppWxOpenConfig::getSettingKey, AppWxOpenConfig::getSettingValue));
            WxOpenConfigInfo wxOpenConfigInfo = new WxOpenConfigInfo();
            BeanUtils.populate(wxOpenConfigInfo, configMap);
            wxOpenConfigStorage.setWxOpenInfo(
                    wxOpenConfigInfo.getComponentAppId(),
                    wxOpenConfigInfo.getComponentAppSecret(),
                    wxOpenConfigInfo.getComponentToken(),
                    wxOpenConfigInfo.getComponentAesKey()
            );
        }
        return wxOpenConfigStorage;
    }
}
