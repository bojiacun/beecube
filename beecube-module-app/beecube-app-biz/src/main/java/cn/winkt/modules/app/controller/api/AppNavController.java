package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.entity.AppNav;
import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppNavService;
import cn.winkt.modules.app.service.IAppSettingService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/app/api/navs")
public class AppNavController {

    @Resource
    IAppNavService appNavService;

    @GetMapping("/all")
    public Result<List<AppNav>> all() {
        QueryWrapper<AppNav> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 1);
        return Result.OK(appNavService.list(queryWrapper));
    }
}
