package cn.winkt.modules.app.config;

import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;

@Configuration
public class AppRealmConfiguration implements ApplicationRunner {

    @Resource
    private DefaultWebSecurityManager defaultWebSecurityManager;


    @Override
    public void run(ApplicationArguments args) throws Exception {
        defaultWebSecurityManager.getRealms().add(new AppRealm());
    }
}
