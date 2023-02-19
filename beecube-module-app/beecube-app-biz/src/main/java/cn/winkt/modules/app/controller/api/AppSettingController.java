package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppSettingService;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/app/api/settings")
public class AppSettingController {

    IAppSettingService appSettingService;

    @GetMapping("/all")
    public Result<List<AppSetting>> all() {
        return Result.OK(appSettingService.list());
    }
}
