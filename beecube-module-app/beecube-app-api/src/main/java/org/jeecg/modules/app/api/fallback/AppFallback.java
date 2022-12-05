package org.jeecg.modules.app.api.fallback;

import lombok.extern.slf4j.Slf4j;
import org.jeecg.modules.app.api.AppApi;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AppFallback implements FallbackFactory<AppApi> {
    @Override
    public AppApi create(Throwable cause) {
        log.error("微服务接口调用失败 {}", cause);
        return null;
    }
}
