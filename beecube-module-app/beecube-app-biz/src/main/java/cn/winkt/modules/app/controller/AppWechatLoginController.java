package cn.winkt.modules.app.controller;


import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.entity.AppModule;
import cn.winkt.modules.app.service.IAppModuleService;
import cn.winkt.modules.app.service.IAppService;
import cn.winkt.modules.app.vo.AppManifest;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.config.AppContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;

@RestController
@RequestMapping("/mp")
public class AppWechatLoginController {
    @Autowired
    private IAppService appService;

    @Resource
    private IAppModuleService appModuleService;

    @GetMapping("/entry")
    @ResponseBody
    public RedirectView entry() {
        String appId = AppContext.getApp();
        App app = appService.getById(appId);
        AppModule appModule = appModuleService.getById(app.getModuleId());
        String homeUrl = "/";
        AppManifest appManifest = JSONObject.parseObject(appModule.getManifest(), AppManifest.class);
        if(StringUtils.isNotEmpty(appManifest.getHomeUrl())) {
            homeUrl = appManifest.getHomeUrl();
        }
        return new RedirectView(homeUrl);
    }
}
