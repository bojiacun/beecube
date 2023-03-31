package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.config.MiniAppOpenService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import me.chanjar.weixin.open.bean.message.WxOpenXmlMessage;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/app/wxopen/event")
@Slf4j
public class AppWxOpenEventController {

    @Resource
    MiniAppOpenService miniAppOpenService;

    @ResponseBody
    @RequestMapping(value = "/authorize", method = {RequestMethod.POST, RequestMethod.PUT})
    public String authorize(@RequestBody String postData) {
        log.info(postData);
        return "success";
    }

    @ResponseBody
    @RequestMapping(value = "/callback/{appId}", method = {RequestMethod.POST, RequestMethod.PUT})
    public String appEventCallback(@RequestBody String postData) {
        log.info(postData);
        return "success";
    }
}
