package cn.winkt.modules.app.api;

import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.AppModule;
import cn.winkt.modules.app.vo.AppSettingVO;
import cn.winkt.modules.app.vo.AppVO;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = AppModuleConstants.SERVICE_APP)
public interface AppApi {
    @PostMapping("/app/modules/register")
    Result<?> registerModule(@RequestBody AppModule module);

    @PutMapping("/app/api/money/in")
    boolean addMemberMoney(@RequestParam("member_id") String memberId, @RequestParam("description") String description, @RequestParam("amount") Float amount);

    @GetMapping("/app/modules/queryByIdentify")
    boolean moduleIsRegistered(@RequestParam(value = "identify") String identify);

    @GetMapping("/app/api/settings")
    List<AppSettingVO> queryAppSettings(@RequestParam("app_id") String appId, @RequestParam("group") String groupKey);

    @GetMapping("/app/api/getMemberById")
    AppMemberVO getMemberById(@RequestParam("id") String id);

    @GetMapping("/app/api/all")
    List<AppVO> allApps();

    @GetMapping("/app/api/system/token")
    String getSystemTempToken();
}
