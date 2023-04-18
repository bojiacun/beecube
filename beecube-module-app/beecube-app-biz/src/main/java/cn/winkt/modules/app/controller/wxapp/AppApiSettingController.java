package cn.winkt.modules.app.controller.wxapp;

import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppSettingService;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class AppApiSettingController {

    @Resource
    IAppSettingService appSettingService;

    @GetMapping("/all")
    public Result<List<AppSetting>> all() {
        return Result.OK(appSettingService.list());
    }
}
