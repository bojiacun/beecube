package cn.winkt.modules.app.controller.api;


import cn.winkt.modules.app.entity.AppDiyPage;
import cn.winkt.modules.app.service.IAppDiyPageService;
import cn.winkt.modules.app.service.IAppService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;

@RequestMapping("/app/pages")
public class AppDiyPageController {

    @Resource
    IAppDiyPageService appDiyPageService;

    @GetMapping("/{identifier}")
    public Result<AppDiyPage> pageDetail(@PathVariable String identifier) {
        QueryWrapper<AppDiyPage> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("identifier", identifier);
        return Result.OK(appDiyPageService.getOne(queryWrapper));
    }
}
