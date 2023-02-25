package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/app/api/members")
public class AppApiAppMemberController {

    @Resource
    IAppMemberService appMemberService;

//    获取当前用户信息
    @GetMapping("/profile")
    public Result<AppMember> memberDetail() {
        LoginUser sysUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(sysUser == null) {
            throw new JeecgBootException("当前未登录");
        }
        return Result.OK(appMemberService.getById(sysUser.getId()));
    }
}
