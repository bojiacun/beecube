package cn.winkt.modules.app.api;

import cn.winkt.modules.app.constant.AppModuleConstants;
import org.jeecg.common.api.vo.Result;
import cn.winkt.modules.app.entity.AppModule;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = AppModuleConstants.SERVICE_APP)
public interface AppApi {
    @PostMapping("/app/modules/register")
    Result<?> registerModule(@RequestBody AppModule module);


    @GetMapping("/app/modules/queryByIdentify")
    boolean moduleIsRegistered(@RequestParam(value = "identify") String identify);
}
