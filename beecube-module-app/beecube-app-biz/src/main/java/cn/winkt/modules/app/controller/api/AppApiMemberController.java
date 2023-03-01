package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/app/api/members")
public class AppApiMemberController {

    @Resource
    AppMemberProvider appMemberProvider;

    @GetMapping
    public LoginUser getUserByName(@RequestParam(name = "username", defaultValue = "") String username) {
        return appMemberProvider.getUserByName(username);
    }
}
