package org.jeecg.app.api.fallback;

import org.jeecg.app.api.AppHelloApi;
import org.springframework.cloud.openfeign.FallbackFactory;
import lombok.Setter;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

/**
 * @author JeecgBoot
 */
@Slf4j
@Component
public class AppHelloFallback implements FallbackFactory<AppHelloApi> {
    @Setter
    private Throwable cause;

    @Override
    public AppHelloApi create(Throwable throwable) {
        log.error("微服务接口调用失败： {}", cause);
        return null;
    }

}
