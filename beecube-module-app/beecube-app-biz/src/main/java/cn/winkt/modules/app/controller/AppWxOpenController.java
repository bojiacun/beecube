package cn.winkt.modules.app.controller;


import cn.binarywang.wx.miniapp.config.WxMaConfig;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import com.github.binarywang.utils.qrcode.QrcodeUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.open.api.WxOpenMaService;
import me.chanjar.weixin.open.api.WxOpenService;
import me.chanjar.weixin.open.api.impl.WxOpenMaServiceImpl;
import me.chanjar.weixin.open.bean.auth.WxOpenAuthorizationInfo;
import me.chanjar.weixin.open.bean.result.WxOpenQueryAuthResult;
import org.jeecg.common.api.vo.Result;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

@RestController
@RequestMapping("/app/wxopen")
@Slf4j
public class AppWxOpenController {

    @Resource
    WxOpenService wxOpenService;

    @Resource
    JeecgBaseConfig jeecgBaseConfig;

    @GetMapping(value = "/auth/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    @ResponseBody
    public BufferedImage createPreAuthQrcode() throws WxErrorException, IOException {
        String url = wxOpenService.getWxOpenComponentService().getMobilePreAuthUrl(String.format("%s%s", jeecgBaseConfig.getDomainUrl().getApp(), "/app/wxopen/event/auth"), "2", null);
        log.info("开放平台授权URL地址为 {}", url);
        return ImageIO.read(new ByteArrayInputStream(QrcodeUtils.createQrcode(url, null)));
    }

    @GetMapping("/auth/url")
    public Result<String> cretePreAuthUrl() throws WxErrorException {
        String url = wxOpenService.getWxOpenComponentService().getPreAuthUrl(String.format("%s%s", jeecgBaseConfig.getDomainUrl().getPc(), "/app/wxopen/auth"), "2", null);
        return Result.OK("", url);
    }

    @GetMapping("/auth/callback")
    public Result<?> authCallback(@RequestParam String auth_code, @RequestParam String expires_in) throws WxErrorException {
        WxOpenQueryAuthResult result = wxOpenService.getWxOpenComponentService().getQueryAuth(auth_code);
        WxOpenAuthorizationInfo wxOpenAuthorizationInfo = result.getAuthorizationInfo();
        String appId = wxOpenAuthorizationInfo.getAuthorizerAppid();
        wxOpenService.getWxOpenConfigStorage().setAuthorizerRefreshToken(appId, wxOpenAuthorizationInfo.getAuthorizerRefreshToken());
        //设置域名信息
        WxMaDefaultConfigImpl wxMaConfig = new WxMaDefaultConfigImpl();
        wxMaConfig.setAppid(appId);
        wxMaConfig.setAccessToken(wxOpenAuthorizationInfo.getAuthorizerAccessToken());
        WxOpenMaService wxOpenMaService = new WxOpenMaServiceImpl(wxOpenService.getWxOpenComponentService(), appId, wxMaConfig);
        wxOpenMaService.modifyDomain("set",
                Collections.singletonList("https://api.beecube.winkt.cn"),
                Collections.singletonList("wss://api.beecube.winkt.cn"),
                Collections.singletonList("https://api.beecube.winkt.cn"),
                Collections.singletonList("https://api.beecube.winkt.cn")
                );

        return Result.OK(result);
    }

//    @GetMapping("/auth/redirect")
//    public RedirectView redirectToWxOpenAuth() throws WxErrorException {
//        String url = wxOpenService.getWxOpenComponentService().getPreAuthUrl(String.format("%s%s", jeecgBaseConfig.getDomainUrl().getApp(), "/app/wxopen/event/auth"));
//        return new RedirectView(url);
//    }
}
