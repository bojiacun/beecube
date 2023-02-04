package cn.winkt.modules.app.config;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppModule;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
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
import org.springframework.core.io.ClassPathResource;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
public abstract class AppRegistryConfigurer implements ApplicationRunner {
    @Resource
    protected AppApi appApi;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        UserTokenContext.setToken(getTemporaryToken());
        String identity = getModuleName();
        log.info("---检测模块是否已经注册---");
        if(!appApi.moduleIsRegistered(identity)) {
            AppModule appModule = buildModule();
            Result<?> result = appApi.registerModule(appModule);
            if(!result.isSuccess()) {
                log.error("安装模块 {} 出错: {}", identity, result.getMessage());
            }
            else {
                log.info("安装模块 {} 成功", identity);
            }
        }
        else {
            //升级操作
        }
        UserTokenContext.remove();
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

    protected abstract String getModuleName();
    protected abstract AppModule buildModule() throws IOException;
}
