package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.config.MiniAppOpenService;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/app/wxopen/event")
public class AppWxOpenEventController {

    @Resource
    MiniAppOpenService miniAppOpenService;

    @ResponseBody
    @RequestMapping(value = "/authorize", method = {RequestMethod.POST, RequestMethod.PUT})
    public String authorize(@RequestBody String postData) {
        return "success";
    }

    @ResponseBody
    @RequestMapping(value = "/callback/{appId}", method = {RequestMethod.POST, RequestMethod.PUT})
    public String appEventCallback(@RequestBody String postData) {
        return "success";
    }
}
