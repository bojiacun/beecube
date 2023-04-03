package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.service.ZeGoService;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/paimai/api/live")
public class WxAppLiveController {

    @Resource
    ZeGoService zeGoService;

    @GetMapping("/test")
    public Result<?> test() {
        return Result.OK(zeGoService.describeUserNum());
    }
}
