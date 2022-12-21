package cn.winkt.modules.app.controller;


import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppModule;
import cn.winkt.modules.app.entity.AppUser;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppModuleService;
import cn.winkt.modules.app.service.IAppService;
import cn.winkt.modules.app.service.IAppUserService;
import cn.winkt.modules.app.vo.AppManifest;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.bean.WxOAuth2UserInfo;
import me.chanjar.weixin.common.bean.oauth2.WxOAuth2AccessToken;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@Controller
@RequestMapping("/mp")
public class AppWechatLoginController {
    @Autowired
    private IAppService appService;

    @Resource
    private IAppModuleService appModuleService;

    @Resource
    private WxMpService wxMpService;

    @Resource
    private JeecgBaseConfig jeecgBaseConfig;

    @Resource
    private IAppMemberService appMemberService;

    @GetMapping("/entry")
    public RedirectView entry(@RequestParam(name = "redirectUrl", required = false) String redirectUrl) {
        String appId = AppContext.getApp();
        App app = appService.getById(appId);
        AppModule appModule = appModuleService.getById(app.getModuleId());
        String homeUrl = "/";
        if(StringUtils.isNotEmpty(redirectUrl)) {
            homeUrl = redirectUrl;
        }
        else {
            AppManifest appManifest = JSONObject.parseObject(appModule.getManifest(), AppManifest.class);
            if(StringUtils.isNotEmpty(appManifest.getHomeUrl())) {
                homeUrl = appManifest.getHomeUrl();
            }
        }
        return new RedirectView(homeUrl);
    }

    //公众号登录跳转OAuth2授权
    @GetMapping("/login")
    public RedirectView login(HttpServletRequest request) {
        String referer = request.getHeader("Referer");
        String url = jeecgBaseConfig.getDomainUrl()+"/mp/dologin?redirectUrl="+referer;
        return new RedirectView(wxMpService.getOAuth2Service().buildAuthorizationUrl(url, WxConsts.OAuth2Scope.SNSAPI_USERINFO, null));
    }

    @GetMapping("/dologin")
    public RedirectView dologin(@RequestParam String code, @RequestParam(required = false) String redirectUrl) throws WxErrorException {
        WxOAuth2AccessToken wxOAuth2AccessToken = wxMpService.getOAuth2Service().getAccessToken(code);
        WxOAuth2UserInfo wxMpUser = wxMpService.getOAuth2Service().getUserInfo(wxOAuth2AccessToken, null);
        //根据OPENID存入系统数据库
        LambdaQueryWrapper<AppMember> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMember::getWechatUnionid, wxMpUser.getUnionId());
        queryWrapper.or().eq(AppMember::getWechatOpenid, wxMpUser.getOpenid());
        AppMember member = appMemberService.getOne(queryWrapper);
        if(member == null) {
            member = new AppMember();
        }
        member.setWechatOpenid(wxMpUser.getOpenid());
        member.setWechatUnionid(wxMpUser.getUnionId());
        member.setAppId(AppContext.getApp());
        member.setAvatar(wxMpUser.getHeadImgUrl());
        member.setNickname(wxMpUser.getNickname());
        member.setAddress(wxMpUser.getProvince()+" "+wxMpUser.getCity()+ " ");
        member.setSex(wxMpUser.getSex());
        member.setCreateTime(new Date());
        member.setStatus(1);
        appMemberService.save(member);

        if(StringUtils.isEmpty(redirectUrl)) {
            redirectUrl = jeecgBaseConfig.getDomainUrl()+"/mp/entry";
        }
        return new RedirectView(redirectUrl);
    }
}
