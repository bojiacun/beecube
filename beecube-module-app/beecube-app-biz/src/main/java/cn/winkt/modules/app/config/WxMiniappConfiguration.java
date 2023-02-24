package cn.winkt.modules.app.config;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.api.impl.WxMaServiceImpl;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppSettingService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import me.chanjar.weixin.mp.config.impl.WxMpDefaultConfigImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class WxMiniappConfiguration {

    @Resource
    IAppSettingService appSettingService;

    @Bean
    @Lazy
    WxMaService wxMaService() {
        Map<String, String> wxappSettings = wxappSettings();
        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(wxappSettings.get("appid"));
        wxMaDefaultConfig.setSecret(wxappSettings.get("appsecret"));
        WxMaService wxMaService = new WxMaServiceImpl();
        wxMaService.setWxMaConfig(wxMaDefaultConfig);
        return wxMaService;
    }


    @Bean
    Map<String, String> wxappSettings() {
        QueryWrapper<AppSetting> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("group_key", "wxapp");
        List<AppSetting> settings = appSettingService.list(queryWrapper);
        Map<String, String> map = new HashMap<>();
        settings.forEach(appSetting -> {
            map.put(appSetting.getSettingKey(), appSetting.getSettingValue());
        });
        return map;
    }
}
