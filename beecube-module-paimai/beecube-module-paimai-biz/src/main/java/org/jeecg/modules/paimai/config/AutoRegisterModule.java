package org.jeecg.modules.paimai.config;

import com.alibaba.fastjson.JSON;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.jeecg.common.config.mqtoken.UserTokenContext;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.common.util.SpringContextUtils;
import org.jeecg.modules.app.api.AppApi;
import org.jeecg.modules.app.entity.AppModule;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Component
public class AutoRegisterModule implements ApplicationRunner {

    public static final String MODULE_IDENTITY = "paimai";

    @Resource
    private AppApi appApi;

    //自动往app注册模块
    @Override
    public void run(ApplicationArguments args) throws Exception {
        UserTokenContext.setToken(getTemporaryToken());
        if(!appApi.moduleIsRegistered(MODULE_IDENTITY)) {
            AppModule appModule = new AppModule();
            appModule.setIdentify(MODULE_IDENTITY);
            appModule.setName("汇智拍卖");
            ClassPathResource logoResource = new ClassPathResource("static/logo.jpeg");
            InputStream imageStream = logoResource.getInputStream();
            byte[] buffer = new byte[(int)logoResource.getFile().length()];
            IOUtils.readFully(imageStream, buffer);
            imageStream.close();
            appModule.setLogo("data:image/jpeg;base64,"+new String(Base64.encodeBase64(buffer)));
            appModule.setAuthor("Mr Bo");
            appModule.setStatus(0);
            appModule.setSupportWechat(1);
            appModule.setSupportH5(1);
            appModule.setSupportDouyin(0);
            appModule.setVersion("1.0.0");
            appModule.setNewVersion("1.0.0");
            appModule.setManifest(JSON.toJSONString(new Object()));
            appApi.registerModule(appModule);
        }
        UserTokenContext.remove();
    }
    /**
     * 获取临时令牌
     *
     * 模拟登陆接口，获取模拟 Token
     * @return
     */
    public static String getTemporaryToken() {
        RedisUtil redisUtil = SpringContextUtils.getBean(RedisUtil.class);
        //模拟登录生成临时Token
        //参数说明：第一个参数是用户名、第二个参数是密码的加密串
        String token = JwtUtil.sign("admin","cb362cfeefbf3d8d");
        // 设置Token缓存有效时间为 5 分钟
        redisUtil.set(CommonConstant.PREFIX_USER_TOKEN + token, token);
        redisUtil.expire(CommonConstant.PREFIX_USER_TOKEN + token, 5 * 60 * 1000);
        return token;
    }
}
