package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.config.MiniAppOpenService;
import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.entity.AppPublish;
import cn.winkt.modules.app.entity.AppWxOpenConfig;
import cn.winkt.modules.app.service.IAppPublishService;
import cn.winkt.modules.app.service.IAppService;
import cn.winkt.modules.app.service.IAppWxOpenConfigService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import me.chanjar.weixin.open.api.WxOpenConfigStorage;
import me.chanjar.weixin.open.bean.message.WxOpenXmlMessage;
import org.jeecg.common.exception.JeecgBootException;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;

@RestController
@RequestMapping("/wxopen/event")
@Slf4j
public class AppWxOpenEventController {

    @Resource
    MiniAppOpenService miniAppOpenService;

    @Resource
    IAppWxOpenConfigService appWxOpenConfigService;

    @Resource
    IAppService appService;

    @Resource
    IAppPublishService appPublishService;

    @ResponseBody
    @RequestMapping(value = "/authorize", method = {RequestMethod.POST, RequestMethod.PUT})
    public String authorize(@RequestBody String postData,
                            @RequestParam String signature,
                            @RequestParam String timestamp,
                            @RequestParam String nonce,
                            @RequestParam String encrypt_type,
                            @RequestParam String msg_signature
    ) {
        log.debug(postData);
        WxOpenConfigStorage wxOpenConfigStorage = miniAppOpenService.getWxOpenConfigStorage();
        WxOpenXmlMessage wxOpenXmlMessage = WxOpenXmlMessage.fromEncryptedXml(postData, wxOpenConfigStorage, timestamp, nonce, msg_signature);
        if (wxOpenXmlMessage == null) {
            throw new JeecgBootException("授权事件解析失败");
        }
        LambdaQueryWrapper<App> appLambdaQueryWrapper = new LambdaQueryWrapper<>();
        App app;
        switch (wxOpenXmlMessage.getInfoType()) {
            case "component_verify_ticket":
                log.debug("票据信息为：{}", wxOpenXmlMessage.getComponentVerifyTicket());
                wxOpenConfigStorage.setComponentVerifyTicket(wxOpenXmlMessage.getComponentVerifyTicket());
                LambdaQueryWrapper<AppWxOpenConfig> queryWrapper = new LambdaQueryWrapper<>();
                queryWrapper.eq(AppWxOpenConfig::getSettingKey, "componentVerifyTicket");
                AppWxOpenConfig appWxOpenConfig = appWxOpenConfigService.getOne(queryWrapper);
                if (appWxOpenConfig == null) {
                    appWxOpenConfig = new AppWxOpenConfig();
                    appWxOpenConfig.setSettingKey("componentVerifyTicket");
                    appWxOpenConfig.setSettingValue(wxOpenXmlMessage.getComponentVerifyTicket());
                    appWxOpenConfigService.save(appWxOpenConfig);
                } else {
                    appWxOpenConfig.setSettingValue(wxOpenXmlMessage.getComponentVerifyTicket());
                    appWxOpenConfigService.updateById(appWxOpenConfig);
                }
                break;
            case "authorized":
                log.debug("{} 授权成功了", wxOpenXmlMessage.getAppId());
                appLambdaQueryWrapper.eq(App::getAuthorizerAppid, wxOpenXmlMessage.getAuthorizerAppid());
                app = appService.getOne(appLambdaQueryWrapper);
                if(app != null) {
                    app.setAuthTime(new Date());
                    app.setAuthStatus(wxOpenXmlMessage.getInfoType());
                    appService.updateById(app);
                }
                break;
            case "unauthorized":
                log.debug("{} 取消授权", wxOpenXmlMessage.getAppId());
                appLambdaQueryWrapper.eq(App::getAuthorizerAppid, wxOpenXmlMessage.getAuthorizerAppid());
                app = appService.getOne(appLambdaQueryWrapper);
                if(app != null) {
                    app.setAuthTime(new Date());
                    app.setAuthStatus(wxOpenXmlMessage.getInfoType());
                    app.setAuthorizerRefreshToken(null);
                    app.setAuthorizerAppid(null);
                    appService.updateById(app);


                    //删除APP的发布历史
                    LambdaQueryWrapper<AppPublish> appPublishLambdaQueryWrapper = new LambdaQueryWrapper<>();
                    appPublishLambdaQueryWrapper.eq(AppPublish::getAppId, app.getId());
                    appPublishService.remove(appPublishLambdaQueryWrapper);
                }
                break;
            case "updateauthorized":
                log.debug("{} 更新授权成功了", wxOpenXmlMessage.getAppId());
                appLambdaQueryWrapper.eq(App::getAuthorizerAppid, wxOpenXmlMessage.getAuthorizerAppid());
                app = appService.getOne(appLambdaQueryWrapper);
                if(app != null) {
                    app.setAuthTime(new Date());
                    app.setAuthStatus(wxOpenXmlMessage.getInfoType());
                    appService.updateById(app);
                }
                break;
        }
        return "success";
    }

    @ResponseBody
    @RequestMapping(value = "/callback/{appId}", method = {RequestMethod.POST, RequestMethod.PUT})
    public String appEventCallback(@RequestBody String postData) {
        log.debug(postData);
        return "success";
    }

    @ResponseBody
    @RequestMapping(value = "/auth", method = {RequestMethod.POST, RequestMethod.PUT})
    public String auth() {
        return "success";
    }
}
