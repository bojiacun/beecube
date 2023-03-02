package cn.winkt.modules.app.api;

import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.AppModule;
import cn.winkt.modules.app.vo.AppSettingVO;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(value = AppModuleConstants.SERVICE_APP)
public interface AppApi {
    @PostMapping("/app/modules/register")
    Result<?> registerModule(@RequestBody AppModule module);


    @GetMapping("/app/modules/queryByIdentify")
    boolean moduleIsRegistered(@RequestParam(value = "identify") String identify);

    @GetMapping("/app/api/settings")
    List<AppSettingVO> queryAppSettings(@RequestParam("app_id") String appId, @RequestParam("group") String groupKey);

    @GetMapping("/app/api/getMemberById")
    AppMemberVO getMemberById(@RequestParam("id") String id);
}
