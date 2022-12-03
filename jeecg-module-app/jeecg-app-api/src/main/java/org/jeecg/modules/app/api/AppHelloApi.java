package org.jeecg.modules.app.api;
import org.jeecg.modules.app.api.fallback.AppHelloFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "jeecg-app", fallbackFactory = AppHelloFallback.class)
public interface AppHelloApi {

    /**
     * app hello 微服务接口
     * @param
     * @return
     */
    @GetMapping(value = "/app/hello")
    String callHello();
}
