package org.jeecg.modules.app.api;

import org.jeecg.modules.app.entity.AppModule;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(value = "beecube-app")
public interface AppApi {
    @PostMapping("/app/modules/register")
    void registerModule(AppModule module);
}
