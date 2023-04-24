package cn.winkt.modules.app.api;

import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.vo.*;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.util.List;

@FeignClient(value = AppModuleConstants.SERVICE_APP)
public interface AppApi {
    @PostMapping("/app/modules/register")
    Result<?> registerModule(@RequestBody AppModule module);

    @PutMapping("/app/admin/money/in")
    boolean addMemberMoney(@RequestParam("member_id") String memberId, @RequestParam("description") String description, @RequestParam("amount") Float amount);

    @GetMapping("/app/modules/queryByIdentify")
    boolean moduleIsRegistered(@RequestParam(value = "identify") String identify);

    @GetMapping("/app/admin/settings")
    List<AppSettingVO> queryAppSettings(@RequestParam("app_id") String appId, @RequestParam("group") String groupKey);
    @GetMapping("/app/admin/tencent/configs")
    List<AppTencentConfigItemVO> tencentConfigs();

    @GetMapping("/app/admin/getMemberById")
    AppMemberVO getMemberById(@RequestParam("id") String id);

    @GetMapping("/app/admin/getAppById")
    AppVO getAppById(@RequestParam String id);

    @GetMapping("/app/admin/all")
    List<AppVO> allApps();

    @GetMapping("/app/admin/system/token")
    String getSystemTempToken();

    @PutMapping("/app/admin/token/verify")
    Boolean verifyToken(@RequestParam String appId, @RequestParam String userId, @RequestParam String token);

    @GetMapping("/app/admin/qrcode")
    BufferedImage getMemberQrcode(@RequestParam String userPath);
}
