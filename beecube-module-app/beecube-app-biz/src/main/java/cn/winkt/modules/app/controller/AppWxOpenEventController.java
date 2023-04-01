package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.config.MiniAppOpenService;
import cn.winkt.modules.app.entity.AppWxOpenConfig;
import cn.winkt.modules.app.service.IAppWxOpenConfigService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import me.chanjar.weixin.open.api.WxOpenConfigStorage;
import me.chanjar.weixin.open.bean.message.WxOpenXmlMessage;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;

@RestController
@RequestMapping("/app/wxopen/event")
@Slf4j
public class AppWxOpenEventController {

    @Resource
    MiniAppOpenService miniAppOpenService;

    @Resource
    IAppWxOpenConfigService appWxOpenConfigService;

    @ResponseBody
    @RequestMapping(value = "/authorize", method = {RequestMethod.POST, RequestMethod.PUT})
    public String authorize(@RequestBody String postData,
                            @RequestParam String signature,
                            @RequestParam String timestamp,
                            @RequestParam String nonce,
                            @RequestParam String encrypt_type,
                            @RequestParam String msg_signature
    ) {
        log.info(postData);
        WxOpenConfigStorage wxOpenConfigStorage = miniAppOpenService.getWxOpenConfigStorage();
        WxOpenXmlMessage wxOpenXmlMessage = WxOpenXmlMessage.fromEncryptedXml(postData, wxOpenConfigStorage, timestamp, nonce, msg_signature);
        if(wxOpenXmlMessage != null && "component_verify_ticket".equals(wxOpenXmlMessage.getInfoType())) {
            log.info("票据信息为：{}", wxOpenXmlMessage.getComponentVerifyTicket());
            wxOpenConfigStorage.setComponentVerifyTicket(wxOpenXmlMessage.getComponentVerifyTicket());
            LambdaQueryWrapper<AppWxOpenConfig> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(AppWxOpenConfig::getSettingKey, "componentVerifyTicket");
            AppWxOpenConfig appWxOpenConfig = appWxOpenConfigService.getOne(queryWrapper);
            if(appWxOpenConfig == null) {
                appWxOpenConfig = new AppWxOpenConfig();
                appWxOpenConfig.setSettingKey("componentVerifyTicket");
                appWxOpenConfig.setSettingValue(wxOpenXmlMessage.getComponentVerifyTicket());
                appWxOpenConfigService.save(appWxOpenConfig);
            }
            else {
                appWxOpenConfig.setSettingValue(wxOpenXmlMessage.getComponentVerifyTicket());
                appWxOpenConfigService.updateById(appWxOpenConfig);
            }
        }
        return "success";
    }

    @ResponseBody
    @RequestMapping(value = "/callback/{appId}", method = {RequestMethod.POST, RequestMethod.PUT})
    public String appEventCallback(@RequestBody String postData) {
        log.info(postData);
        return "success";
    }

    @ResponseBody
    @RequestMapping(value = "/auth", method = {RequestMethod.POST, RequestMethod.PUT})
    public String auth() {
        return "success";
    }
}
