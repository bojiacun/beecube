package cn.winkt.modules.app.api;

import cn.winkt.modules.app.vo.AppGateway;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.ServiceNameConstants;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(value = ServiceNameConstants.SERVICE_SYSTEM)
public interface SystemApi {


    @PostMapping("/sys/gatewayRoute/updateAll")
    Result<?> updateAll(JSONObject appGateway);
}
