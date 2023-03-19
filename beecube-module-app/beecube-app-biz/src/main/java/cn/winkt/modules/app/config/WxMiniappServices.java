package cn.winkt.modules.app.config;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.api.impl.WxMaServiceImpl;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppSettingService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WxMiniappServices {

    @Resource
    IAppSettingService appSettingService;

    private static final Map<String, WxMaService> wxMaServiceMap = new HashMap<>();

    public WxMaService getService(String appId) {
        if(wxMaServiceMap.containsKey(appId)) {
            return wxMaServiceMap.get(appId);
        }
        Map<String, String> wxappSettings = wxappSettings(appId);
        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(wxappSettings.get("appid"));
        wxMaDefaultConfig.setSecret(wxappSettings.get("appsecret"));
        WxMaService wxMaService = new WxMaServiceImpl();
        wxMaService.setWxMaConfig(wxMaDefaultConfig);
        wxMaServiceMap.put(appId, wxMaService);
        return wxMaService;
    }

    public void remove(String appId) {
        wxMaServiceMap.remove(appId);
    }


    Map<String, String> wxappSettings(String appId) {
        LambdaQueryWrapper<AppSetting> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppSetting::getGroupKey, "wxapp");
        queryWrapper.eq(AppSetting::getAppId, appId);
        List<AppSetting> settings = appSettingService.list(queryWrapper);
        Map<String, String> map = new HashMap<>();
        settings.forEach(appSetting -> {
            map.put(appSetting.getSettingKey(), appSetting.getSettingValue());
        });
        return map;
    }
}
