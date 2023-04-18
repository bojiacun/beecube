package cn.winkt.modules.app.config;

import feign.Client;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Component;

@Component
public class FeignAppContextInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        requestTemplate.header(CommonConstant.X_APP_ID, AppContext.getApp());
    }
}
