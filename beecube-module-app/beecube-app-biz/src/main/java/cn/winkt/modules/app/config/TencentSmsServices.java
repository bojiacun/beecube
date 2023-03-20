package cn.winkt.modules.app.config;

import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppSettingService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class TencentSmsServices {

    @Resource
    IAppSettingService appSettingService;

    private static final Map<String, TencentSmsService> tencentSmsServiceMap = new HashMap<>();


    public TencentSmsService getService(String appId) {
        if(tencentSmsServiceMap.containsKey(appId)) {
            return tencentSmsServiceMap.get(appId);
        }
        Map<String, String> settings = tencentSmsSettings(appId);
        TencentSmsService tencentSmsService = new TencentSmsService();
        tencentSmsService.setSecretKey(settings.get("secretKey"));
        tencentSmsService.setSecretId(settings.get("secretId"));
        tencentSmsService.setTemplateId(settings.get("templateId"));
        tencentSmsService.setSignName(settings.get("signName"));
        tencentSmsService.setAppId(settings.get("appId"));
        tencentSmsServiceMap.put(appId, tencentSmsService);
        return tencentSmsService;
    }

    public void clear(String appId) {
        tencentSmsServiceMap.remove(appId);
    }


    Map<String, String> tencentSmsSettings(String appId) {
        LambdaQueryWrapper<AppSetting> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppSetting::getGroupKey, "tencent_sms");
        queryWrapper.eq(AppSetting::getAppId, appId);
        List<AppSetting> settings = appSettingService.list(queryWrapper);
        Map<String, String> map = new HashMap<>();
        settings.forEach(appSetting -> {
            map.put(appSetting.getSettingKey(), appSetting.getSettingValue());
        });
        return map;
    }
}
