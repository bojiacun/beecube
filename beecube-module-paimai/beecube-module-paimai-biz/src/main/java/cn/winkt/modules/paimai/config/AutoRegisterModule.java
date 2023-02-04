package cn.winkt.modules.paimai.config;

import cn.winkt.modules.app.config.AppRegistryConfigurer;
import cn.winkt.modules.app.vo.AppManifest;
import cn.winkt.modules.app.vo.AppModule;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.math.NumberUtils;
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
        ClassPathResource manifestResouce = new ClassPathResource("static/manifest.json");
        appModule.setIdentify(getModuleName());
        byte[] manifestBuffer = new byte[(int) manifestResouce.getFile().length()];
        IOUtils.readFully(manifestResouce.getInputStream(), manifestBuffer);
        manifestResouce.getInputStream().close();
        AppManifest appManifest = JSONObject.parseObject(new String(manifestBuffer), AppManifest.class);
        appModule.setName(appManifest.getName());
        appModule.setDescription(appManifest.getDescription());

        ClassPathResource logoResource = new ClassPathResource("static/logo.jpeg");
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
        appModule.setNewVersion(appManifest.getNewVersion());
        appModule.setManifest(new String(manifestBuffer));
        return appModule;
    }
}
