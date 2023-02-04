package cn.winkt.modules.app.config;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.jeecg.common.constant.CommonConstant;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;

@Configuration
public class AppRealmConfiguration implements ApplicationRunner {

    @Resource
    private DefaultWebSecurityManager defaultWebSecurityManager;

    @Resource
    ShiroFilterFactoryBean shiroFilterFactoryBean;

    @Resource
    Environment env;

    @Bean
    public void extendShiroConfig() {
        Object cloudServer = env.getProperty(CommonConstant.CLOUD_SERVER_KEY);
        shiroFilterFactoryBean.getFilters().put("wechat", new WechatJwtFilter(cloudServer == null));
        defaultWebSecurityManager.getRealms().add(new AppRealm());
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
    }
}
