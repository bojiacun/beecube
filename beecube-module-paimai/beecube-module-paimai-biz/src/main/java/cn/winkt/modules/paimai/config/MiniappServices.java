package cn.winkt.modules.paimai.config;


import cn.binarywang.wx.miniapp.api.WxMaLinkService;
import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.api.impl.WxMaLinkServiceImpl;
import cn.binarywang.wx.miniapp.api.impl.WxMaServiceImpl;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppSettingVO;
import cn.winkt.modules.paimai.vo.WxAppSetting;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.github.binarywang.wxpay.config.WxPayConfig;
import com.github.binarywang.wxpay.service.WxPayService;
import com.github.binarywang.wxpay.service.impl.WxPayServiceImpl;
import org.apache.commons.beanutils.BeanUtils;
import org.codehaus.groovy.runtime.metaclass.ConcurrentReaderHashMap;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MiniappServices {

    @Resource
    AppApi appApi;

    private final static ConcurrentHashMap<String, WxPayService> wxPayServices = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, WxMaService> wxMaServiceMap = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, WxMaLinkService> wxMaLinkServiceMap = new ConcurrentHashMap<>();


    public WxMaLinkService getWxMaLinkService(String appId) throws InvocationTargetException, IllegalAccessException {
        if(wxMaLinkServiceMap.containsKey(appId)) {
            return wxMaLinkServiceMap.get(appId);
        }
        WxMaLinkService wxMaLinkService = new WxMaLinkServiceImpl(getWxMaService(appId));
        wxMaLinkServiceMap.put(appId, wxMaLinkService);
        return wxMaLinkService;
    }


    public WxMaService getWxMaService(String appId) throws InvocationTargetException, IllegalAccessException {
        if(wxMaServiceMap.containsKey(appId)) {
            return wxMaServiceMap.get(appId);
        }
        Map<String, String> configs = wxappSettings(appId);
        WxAppSetting wxappSetting = new WxAppSetting();
        BeanUtils.populate(wxappSetting, configs);

        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(wxappSetting.getAppid());
        wxMaDefaultConfig.setSecret(wxappSetting.getAppsecret());
        WxMaService wxMaService = new WxMaServiceImpl();
        wxMaService.setWxMaConfig(wxMaDefaultConfig);
        wxMaServiceMap.put(appId, wxMaService);
        return wxMaService;
    }
    public WxPayService getService(String appId) throws InvocationTargetException, IllegalAccessException {
        if(wxPayServices.containsKey(appId)) {
            return wxPayServices.get(appId);
        }
        List<AppSettingVO> settings = appApi.queryAppSettings(appId, "wxapp");
        Map<String, String> configs = settings.stream()
                .filter(setting -> setting != null && setting.getSettingValue() != null)
                .collect(Collectors.toMap(AppSettingVO::getSettingKey, AppSettingVO::getSettingValue));

        WxPayConfig config = new WxPayConfig();
        WxAppSetting wxappSetting = new WxAppSetting();
        BeanUtils.populate(wxappSetting, configs);
        config.setAppId(wxappSetting.getAppid());
        config.setMchId(wxappSetting.getMerchId());
        config.setMchKey(wxappSetting.getMerchSecret());
        config.setKeyPath(wxappSetting.getApiclientP12());
        config.setPrivateKeyPath(wxappSetting.getApiclientKey());
        config.setPrivateCertPath(wxappSetting.getApiclientCert());
        config.setTradeType("JSAPI");
        config.setSignType("MD5");
        WxPayService wxPayService = new WxPayServiceImpl();
        wxPayService.setConfig(config);
        wxPayServices.put(appId, wxPayService);
        return wxPayService;
    }

    public void clear(String appId) {
        wxPayServices.remove(appId);
        wxMaServiceMap.remove(appId);
    }

    private Map<String, String> wxappSettings(String appId) {
        List<AppSettingVO> settings = appApi.queryAppSettings(appId, "wxapp");
        Map<String, String> map = new HashMap<>();
        settings.forEach(appSetting -> {
            map.put(appSetting.getSettingKey(), appSetting.getSettingValue());
        });
        return map;
    }
}
