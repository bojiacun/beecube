package cn.winkt.modules.app.config;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppManifest;
import cn.winkt.modules.app.vo.AppModule;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.jeecg.common.api.CommonAPI;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.config.mqtoken.UserTokenContext;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.common.util.SpringContextUtils;
import org.jeecg.config.shiro.LoginType;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class AppRegistryConfigurer implements ApplicationRunner {
    @Resource
    protected AppApi appApi;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        AppModule appModule = buildModule();
        if(appModule != null) {
            UserTokenContext.setToken(getTemporaryToken());
            appApi.registerModule(appModule);
            UserTokenContext.remove();
        }
    }


    /**
     * 获取临时令牌
     *
     * 模拟登陆接口，获取模拟 Token
     * @return
     */
    private static String getTemporaryToken() {
        RedisUtil redisUtil = SpringContextUtils.getBean(RedisUtil.class);
        //模拟登录生成临时Token
        //参数说明：第一个参数是用户名、第二个参数是密码的加密串
        String token = JwtUtil.sign("admin","cb362cfeefbf3d8d");
        // 设置Token缓存有效时间为 5 分钟
        redisUtil.set(CommonConstant.PREFIX_USER_TOKEN + token, token);
        redisUtil.expire(CommonConstant.PREFIX_USER_TOKEN + token, 5 * 60 * 1000);
        return token;
    }
    protected AppModule buildModule() throws IOException {
        ClassPathResource manifestResource = new ClassPathResource("manifest.json");
        if(!manifestResource.exists() || !manifestResource.isReadable()) {
            return null;
        }
        AppModule appModule = new AppModule();
        byte[] manifestBuffer = new byte[(int) manifestResource.getFile().length()];
        IOUtils.readFully(manifestResource.getInputStream(), manifestBuffer);
        manifestResource.getInputStream().close();
        AppManifest appManifest = JSONObject.parseObject(new String(manifestBuffer), AppManifest.class);
        appModule.setIdentify(appManifest.getIdentify());
        appModule.setName(appManifest.getName());
        appModule.setDescription(appManifest.getDescription());

        ClassPathResource logoResource = new ClassPathResource("logo.jpeg");
        InputStream imageStream = logoResource.getInputStream();
        byte[] buffer = new byte[(int) logoResource.getFile().length()];
        IOUtils.readFully(imageStream, buffer);
        imageStream.close();
        appModule.setLogo("data:image/jpeg;base64," + new String(Base64.encodeBase64(buffer)));

        appModule.setAuthor(appManifest.getAuthor());
        appModule.setStatus(0);
        appModule.setSupportWechat(NumberUtils.toInt(appManifest.getSupportWechat(),0));
        appModule.setSupportH5(NumberUtils.toInt(appManifest.getSupportH5(), 0));
        appModule.setSupportDouyin(NumberUtils.toInt(appManifest.getSupportDouyin(), 0));
        appModule.setVersion(appManifest.getVersion());
        appModule.setManifest(new String(manifestBuffer));
        return appModule;
    };
}
