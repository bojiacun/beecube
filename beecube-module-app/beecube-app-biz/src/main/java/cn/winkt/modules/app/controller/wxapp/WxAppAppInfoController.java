package cn.winkt.modules.app.controller.wxapp;

import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.service.IAppService;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/app")
public class WxAppAppInfoController {

    @Resource
    private IAppService appService;

    @GetMapping("/{id}")
    public Result<App> info(@PathVariable String id) {
        return Result.OK(appService.getById(id));
    }
}
