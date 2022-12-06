package org.jeecg.modules.paimai.config;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.jeecg.modules.app.api.AppApi;
import org.jeecg.modules.app.entity.AppModule;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;

@Component
public class AutoRegisterModule implements ApplicationRunner {

    public static final String MODULE_IDENTITY = "paimai";

    @Resource
    private AppApi appApi;

    //自动往app注册模块
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(!appApi.moduleIsRegistered(MODULE_IDENTITY)) {
            AppModule appModule = new AppModule();
            appModule.setIdentify(MODULE_IDENTITY);
            appModule.setName("汇智拍卖");
            File file = ResourceUtils.getFile("static/logo.jpeg");
            FileInputStream imageStream = new FileInputStream(file);
            byte[] buffer = new byte[(int)file.length()];
            IOUtils.readFully(imageStream, buffer);
            imageStream.close();
            appModule.setLogo(new String(Base64.encodeBase64(buffer)));
            appModule.setAuthor("Mr Bo");
            appModule.setStatus(0);
            appModule.setSupportWechat(1);
            appModule.setSupportH5(1);
            appModule.setVersion("1.0.0");
            appModule.setManifest("");
            appApi.registerModule(appModule);
        }
    }
}
