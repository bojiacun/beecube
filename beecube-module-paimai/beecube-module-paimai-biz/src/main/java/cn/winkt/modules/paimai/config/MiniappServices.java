package cn.winkt.modules.paimai.config;


import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppSettingVO;
import cn.winkt.modules.paimai.vo.WxAppSetting;
import com.github.binarywang.wxpay.config.WxPayConfig;
import com.github.binarywang.wxpay.service.WxPayService;
import com.github.binarywang.wxpay.service.impl.WxPayServiceImpl;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MiniappServices {

    @Resource
    AppApi appApi;

    private final static Map<String, WxPayService> wxPayServices = new HashMap<>();


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
        config.setAppId(wxappSetting.getAppId());
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
}
