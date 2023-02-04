package cn.winkt.modules.app.config;

import org.apache.shiro.realm.Realm;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.config.shiro.ShiroConfigurer;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;
import javax.servlet.Filter;
import java.util.*;

@Configuration
public class AppRealmConfiguration implements ShiroConfigurer {

    @Resource
    Environment env;



    @Override
    public Collection<Realm> extendRealms() {
        return Collections.singletonList(new AppRealm());
    }

    @Override
    public Map<String, Filter> extendFilters() {
        Map<String, Filter> map = new HashMap<>();
        Object cloudServer = env.getProperty(CommonConstant.CLOUD_SERVER_KEY);
        map.put("wechat", new WechatJwtFilter(cloudServer == null));
        return map;
    }
}
