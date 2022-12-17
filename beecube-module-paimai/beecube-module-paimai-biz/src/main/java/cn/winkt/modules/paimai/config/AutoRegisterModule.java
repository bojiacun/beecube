package cn.winkt.modules.paimai.config;

import cn.winkt.modules.app.config.AppRegistryConfigurer;
import cn.winkt.modules.app.vo.AppModule;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.io.InputStream;

@Component
@Slf4j
public class AutoRegisterModule extends AppRegistryConfigurer {


    @Override
    protected String getModuleName() {
        return "paimai";
    }

    @Override
    protected AppModule buildModule() throws IOException {
        AppModule appModule = new AppModule();
        appModule.setIdentify(getModuleName());
        appModule.setName("汇智拍卖");
        ClassPathResource logoResource = new ClassPathResource("static/logo.jpeg");
        ClassPathResource manifestResouce = new ClassPathResource("static/manifest.json");
        InputStream imageStream = logoResource.getInputStream();
        byte[] buffer = new byte[(int) logoResource.getFile().length()];
        IOUtils.readFully(imageStream, buffer);
        imageStream.close();
        byte[] manifestBuffer = new byte[(int) manifestResouce.getFile().length()];
        IOUtils.readFully(manifestResouce.getInputStream(), manifestBuffer);
        manifestResouce.getInputStream().close();


        appModule.setLogo("data:image/jpeg;base64," + new String(Base64.encodeBase64(buffer)));
        appModule.setAuthor("Mr Bo");
        appModule.setStatus(0);
        appModule.setSupportWechat(1);
        appModule.setSupportH5(1);
        appModule.setSupportDouyin(0);
        appModule.setVersion("1.0.0");
        appModule.setNewVersion("1.0.0");
        appModule.setManifest(new String(manifestBuffer));
        return appModule;
    }
}
