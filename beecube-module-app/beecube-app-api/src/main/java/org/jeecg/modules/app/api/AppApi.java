package org.jeecg.modules.app.api;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(value = "beecube-app")
public interface AppApi {
}
