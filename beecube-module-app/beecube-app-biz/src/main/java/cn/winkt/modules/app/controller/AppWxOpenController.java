package cn.winkt.modules.app.controller;


import com.github.binarywang.utils.qrcode.QrcodeUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.open.api.WxOpenService;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;

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
        String url = wxOpenService.getWxOpenComponentService().getPreAuthUrl(String.format("%s%s", jeecgBaseConfig.getDomainUrl().getApp(), "/app/wxopen/event/auth"));
        log.info("开放平台授权URL地址为 {}", url);
        return ImageIO.read(new ByteArrayInputStream(QrcodeUtils.createQrcode(url, null)));
    }
}
