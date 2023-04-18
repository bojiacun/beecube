package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.entity.AppDiyPage;
import cn.winkt.modules.app.service.IAppDiyPageService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RequestMapping("/api/pages")
@RestController
public class AppApiDiyPageController {

    @Resource
    IAppDiyPageService appDiyPageService;

    @GetMapping("/{identifier}")
    public Result<AppDiyPage> pageDetail(@PathVariable String identifier) {
        QueryWrapper<AppDiyPage> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("identifier", identifier);
        return Result.OK(appDiyPageService.getOne(queryWrapper));
    }
}
