package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.entity.AppMemberWithdraw;
import cn.winkt.modules.app.service.IAppMemberWithdrawService;
import cn.winkt.modules.app.vo.AppBadges;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/badges")
public class AppBadagesController {

    @Resource
    private IAppMemberWithdrawService appMemberWithdrawService;

    @GetMapping
    public Result<AppBadges> appBadges() {
        AppBadges appBadges = new AppBadges();
        LambdaQueryWrapper<AppMemberWithdraw> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMemberWithdraw::getStatus, 0);
        appBadges.setWithdraws((int) appMemberWithdrawService.count(queryWrapper));
        return Result.OK(appBadges);
    }
}
