package org.jeecg.modules.paimai.api;
import org.jeecg.modules.paimai.api.fallback.PaimaiHelloFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "jeecg-paimai", fallbackFactory = PaimaiHelloFallback.class)
public interface PaimaiHelloApi {

    /**
     * paimai hello 微服务接口
     * @param
     * @return
     */
    @GetMapping(value = "/paimai/hello")
    String callHello();
}
