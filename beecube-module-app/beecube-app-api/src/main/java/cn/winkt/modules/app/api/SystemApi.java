package cn.winkt.modules.app.api;

import cn.winkt.modules.app.vo.AppGateway;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.ServiceNameConstants;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = ServiceNameConstants.SERVICE_SYSTEM)
public interface SystemApi {


    @PostMapping("/sys/gatewayRoute/updateAll")
    Result<?> gatewayUpdateAll(JSONObject appGateway);

    @GetMapping("/sys/gatewayRoute/list")
    Result<?> gatewayList();

    @DeleteMapping("/sys/gatewayRoute/delete")
    Result<?> delete(@RequestParam String id);
}
