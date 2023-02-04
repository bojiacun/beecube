package cn.winkt.modules.app.config;

import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.api.impl.WxMpServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WxMpServiceConfiguration {


    @Bean
    WxMpService wxMpService() {
        WxMpService wxMpService = new WxMpServiceImpl();
        return wxMpService;
    }
}
