package cn.winkt.modules.app.controller;


import cn.binarywang.wx.miniapp.bean.code.WxMaCodeSubmitAuditItem;
import cn.binarywang.wx.miniapp.bean.code.WxMaCodeSubmitAuditRequest;
import cn.binarywang.wx.miniapp.config.WxMaConfig;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.entity.AppPublish;
import cn.winkt.modules.app.service.IAppPublishService;
import cn.winkt.modules.app.service.IAppService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.github.binarywang.utils.qrcode.QrcodeUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.open.api.WxOpenMaService;
import me.chanjar.weixin.open.api.WxOpenService;
import me.chanjar.weixin.open.api.impl.WxOpenMaServiceImpl;
import me.chanjar.weixin.open.bean.WxOpenMaCodeTemplate;
import me.chanjar.weixin.open.bean.auth.WxOpenAuthorizationInfo;
import me.chanjar.weixin.open.bean.ma.WxOpenMaCategory;
import me.chanjar.weixin.open.bean.message.WxOpenMaSubmitAuditMessage;
import me.chanjar.weixin.open.bean.result.WxOpenMaCategoryListResult;
import me.chanjar.weixin.open.bean.result.WxOpenMaSubmitAuditResult;
import me.chanjar.weixin.open.bean.result.WxOpenQueryAuthResult;
import me.chanjar.weixin.open.bean.result.WxOpenResult;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.util.*;

@RestController
@RequestMapping("/app/wxopen")
@Slf4j
public class AppWxOpenController {

    @Resource
    WxOpenService wxOpenService;

    @Resource
    JeecgBaseConfig jeecgBaseConfig;

    @Resource
    IAppService appService;

    @Resource
    IAppPublishService appPublishService;

    private static final String BASE64_PRE = "data:image/jpg;base64,";

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

    @PostMapping("/auth/release")
    public Result<?> releasePublic(@RequestBody AppPublish publish) throws WxErrorException {
        App app = appService.getById(AppContext.getApp());
        if(app == null) {
            throw new JeecgBootException("找不到APP");
        }
        if(!app.getAuthStatus().equals("authorized") || StringUtils.isEmpty(app.getAuthorizerRefreshToken())) {
            throw new JeecgBootException("无法获取刷新令牌");
        }
        wxOpenService.getWxOpenConfigStorage().setAuthorizerRefreshToken(app.getAuthorizerAppid(), app.getAuthorizerRefreshToken());

        String appAccessToken = wxOpenService.getWxOpenComponentService().getAuthorizerAccessToken(app.getAuthorizerAppid(), false);
        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(app.getAuthorizerAppid());
        wxMaDefaultConfig.setAccessToken(appAccessToken);
        WxOpenMaService wxOpenMaService = new WxOpenMaServiceImpl(wxOpenService.getWxOpenComponentService(), app.getAuthorizerAppid(), wxMaDefaultConfig);

        WxOpenResult result = wxOpenMaService.releaseAudited();
        publish.setStatus(4);
        appPublishService.updateById(publish);

        return Result.OK(publish);
    }

    @PostMapping("/auth/public")
    public Result<?> publicUpload(@RequestBody AppPublish publish) throws WxErrorException {
        App app = appService.getById(AppContext.getApp());
        if(app == null) {
            throw new JeecgBootException("找不到APP");
        }
        if(!app.getAuthStatus().equals("authorized") || StringUtils.isEmpty(app.getAuthorizerRefreshToken())) {
            throw new JeecgBootException("无法获取刷新令牌");
        }
        wxOpenService.getWxOpenConfigStorage().setAuthorizerRefreshToken(app.getAuthorizerAppid(), app.getAuthorizerRefreshToken());

        String appAccessToken = wxOpenService.getWxOpenComponentService().getAuthorizerAccessToken(app.getAuthorizerAppid(), false);
        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(app.getAuthorizerAppid());
        wxMaDefaultConfig.setAccessToken(appAccessToken);
        WxOpenMaService wxOpenMaService = new WxOpenMaServiceImpl(wxOpenService.getWxOpenComponentService(), app.getAuthorizerAppid(), wxMaDefaultConfig);

        //提交代码审核


        //获取小程序已经申请好的类目
        WxOpenMaCategoryListResult categoryListResult = wxOpenMaService.getCategoryList();
        List<WxOpenMaCategory> categories = categoryListResult.getCategoryList();
        if(categories.size() == 0) {
            throw new JeecgBootException("请先去小程序后台设置好服务类目后再来发布审核");
        }

        WxOpenMaSubmitAuditMessage message = new WxOpenMaSubmitAuditMessage();
        List<WxMaCodeSubmitAuditItem> itemList = new ArrayList<>();

        categories.forEach(wxOpenMaCategory -> {
            WxMaCodeSubmitAuditItem item = new WxMaCodeSubmitAuditItem();
            item.setFirstClass(wxOpenMaCategory.getFirstClass());
            item.setFirstId(Long.valueOf(wxOpenMaCategory.getFirstId()));
            item.setSecondClass(wxOpenMaCategory.getSecondClass());
            item.setSecondId(Long.valueOf(wxOpenMaCategory.getSecondId()));
            itemList.add(item);
        });

        message.setItemList(itemList);
        WxOpenMaSubmitAuditResult result = wxOpenMaService.submitAudit(message);
        publish.setAuditId(result.getAuditId());
        publish.setStatus(1);
        appPublishService.updateById(publish);
        return Result.OK(publish);
    }

    @PostMapping("/auth/upload")
    public Result<?> upload() throws WxErrorException, IOException {
        App app = appService.getById(AppContext.getApp());
        if(app == null) {
            throw new JeecgBootException("找不到APP");
        }
        if(!app.getAuthStatus().equals("authorized") || StringUtils.isEmpty(app.getAuthorizerRefreshToken())) {
            throw new JeecgBootException("无法获取刷新令牌");
        }

        wxOpenService.getWxOpenConfigStorage().setAuthorizerRefreshToken(app.getAuthorizerAppid(), app.getAuthorizerRefreshToken());

        String appAccessToken = wxOpenService.getWxOpenComponentService().getAuthorizerAccessToken(app.getAuthorizerAppid(), false);


        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(app.getAuthorizerAppid());
        wxMaDefaultConfig.setAccessToken(appAccessToken);
        WxOpenMaService wxOpenMaService = new WxOpenMaServiceImpl(wxOpenService.getWxOpenComponentService(), app.getAuthorizerAppid(), wxMaDefaultConfig);

        //修改小程序域名
        wxOpenMaService.modifyDomain("set",
                Arrays.asList("https://api.beecube.winkt.cn", "https://static.winkt.cn", "https://apis.map.qq.com", "https://restapi.amap.com"),
                Collections.singletonList("wss://api.beecube.winkt.cn"),
                Arrays.asList("https://api.beecube.winkt.cn", "https://static.winkt.cn", "https://apis.map.qq.com", "https://restapi.amap.com"),
                Arrays.asList("https://api.beecube.winkt.cn", "https://static.winkt.cn", "https://apis.map.qq.com", "https://restapi.amap.com")
        );
        //设置业务域名
        wxOpenMaService.setWebViewDomain("set", Collections.singletonList("https://api.beecube.winkt.cn"));

        //上传代码,永远是最新一份
        List<WxOpenMaCodeTemplate> templates = wxOpenService.getWxOpenComponentService().getTemplateList(0);
        if(templates.size() == 0) {
            throw new JeecgBootException("模板为空");
        }
        WxOpenMaCodeTemplate distTemplate = templates.get(0);
        JSONObject extJsonObject = new JSONObject();
        extJsonObject.put("appId", AppContext.getApp());
        extJsonObject.put("siteroot", "https://api.beecube.winkt.cn");
        wxOpenMaService.codeCommit(distTemplate.getTemplateId(), distTemplate.getUserVersion(), distTemplate.getUserDesc(), extJsonObject);

        //获取体验二维码
        File qrcode = wxOpenMaService.getTestQrcode("pages/index/index", null);
        String base64 = Base64.getEncoder().encodeToString(IOUtils.toByteArray(Files.newInputStream(qrcode.toPath())));
        base64 = base64.replaceAll("\n", "").replaceAll("\r", "");
        base64 = BASE64_PRE+base64;

        AppPublish appPublish = new AppPublish();
        appPublish.setPreviewQrcode(base64);
        appPublish.setStatus(0);
        appPublish.setPubTime(new Date());
        appPublish.setVersion(distTemplate.getUserVersion());
        appPublishService.save(appPublish);

        return Result.OK(appPublish);
    }


    @GetMapping("/auth/callback")
    public Result<?> authCallback(@RequestParam String auth_code, @RequestParam String expires_in) throws WxErrorException {
        WxOpenQueryAuthResult result = wxOpenService.getWxOpenComponentService().getQueryAuth(auth_code);
        WxOpenAuthorizationInfo wxOpenAuthorizationInfo = result.getAuthorizationInfo();
        String appId = wxOpenAuthorizationInfo.getAuthorizerAppid();
        wxOpenService.getWxOpenConfigStorage().setAuthorizerRefreshToken(appId, wxOpenAuthorizationInfo.getAuthorizerRefreshToken());

        //设置应用信息
        App app = appService.getById(AppContext.getApp());
        if(app == null) {
            throw new JeecgBootException("找不到APP");
        }
        app.setAuthStatus("authorized");
        app.setAuthTime(new Date());
        app.setAuthorizerAppid(appId);
        app.setAuthorizerRefreshToken(wxOpenAuthorizationInfo.getAuthorizerRefreshToken());
        appService.updateById(app);

        return Result.OK(app);
    }
}
