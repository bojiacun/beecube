package cn.winkt.modules.app.api;

import cn.winkt.modules.app.vo.AppGateway;
import cn.winkt.modules.app.vo.AppMenu;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.ServiceNameConstants;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(value = ServiceNameConstants.SERVICE_SYSTEM)
public interface SystemApi {


    @PostMapping("/sys/gatewayRoute/updateAll")
    Result<?> gatewayUpdateAll(JSONObject appGateway);

    @GetMapping("/sys/gatewayRoute/list")
    Result<?> gatewayList();

    @DeleteMapping("/sys/gatewayRoute/delete")
    Result<?> delete(@RequestParam String id);


    @PostMapping("/sys/permission/add")
    Result<AppMenu> createMenu(@RequestBody AppMenu appMenu);
}
