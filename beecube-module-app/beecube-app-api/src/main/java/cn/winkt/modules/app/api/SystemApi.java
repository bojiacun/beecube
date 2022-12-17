package cn.winkt.modules.app.api;

import cn.winkt.modules.app.vo.AppGateway;
import cn.winkt.modules.app.vo.AppMenu;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.ServiceNameConstants;
import org.jeecg.config.feign.FeignSeataInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = ServiceNameConstants.SERVICE_SYSTEM, configuration = FeignSeataInterceptor.class)
public interface SystemApi {


    @PostMapping("/sys/gatewayRoute/updateAll")
    Result<?> gatewayUpdateAll(JSONObject appGateway);

    @GetMapping("/sys/gatewayRoute/list")
    Result<?> gatewayList();

    @DeleteMapping("/sys/gatewayRoute/delete")
    Result<?> delete(@RequestParam String id);


    @PostMapping("/sys/permission/add")
    Result<AppMenu> createMenu(@RequestBody AppMenu appMenu);

    @GetMapping("/sys/permission/list")
    Result<List<AppMenu>> listMenu(@SpringQueryMap AppMenu searchMenu);

    @DeleteMapping("/sys/permission/deleteBatch")
    Result<AppMenu> deleteBatch(@RequestParam String ids);
}
