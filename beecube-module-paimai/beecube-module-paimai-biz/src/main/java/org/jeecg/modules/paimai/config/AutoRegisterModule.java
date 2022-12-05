package org.jeecg.modules.paimai.config;

import org.jeecg.modules.app.api.AppApi;
import org.jeecg.modules.app.entity.AppModule;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class AutoRegisterModule implements ApplicationRunner {

    @Resource
    private AppApi appApi;

    //自动往app注册模块
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(!appApi.moduleIsRegistered("paimai")) {

        }
    }
}
