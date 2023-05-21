package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.MemberSignIn;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IMemberSignInService;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/signin")
public class WxAppSignInController {

    @Resource
    private IMemberSignInService memberSignInService;

    @Resource
    private IAppMemberService appMemberService;

    /**
     * 获取当前用户的签到数据，如果断签则为空，没有断签则返回整个周期内的签到数据
     * @return
     */
    @GetMapping("/info")
    public Result<List<MemberSignIn>> mySignInInfos() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        List<MemberSignIn> memberSignIns = memberSignInService.selectLatestCycleList(loginUser.getId());
        //判断是否断了
        if(memberSignIns.size() == 0) {
            return Result.OK(Collections.emptyList());
        }
        Date distDate = DateUtils.addDays(memberSignIns.get(0).getCreateTime(), memberSignIns.size());
        if(DateUtils.isSameDay(distDate, new Date())) {
            return Result.OK(memberSignIns);
        }
        return Result.OK(Collections.emptyList());
    }
    @PostMapping
    public Result<List<MemberSignIn>> signinToday() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMember appMember = appMemberService.getById(loginUser.getId());
        List<MemberSignIn> memberSignIns = memberSignInService.selectLatestCycleList(loginUser.getId());

        MemberSignIn memberSignIn = new MemberSignIn();
        memberSignIn.setMemberId(loginUser.getId());
        memberSignIn.setDayIndex(memberSignIns.size()+1);
        memberSignIn.setMemberName(appMember.getRealname());
        memberSignIn.setMemberAvatar(appMember.getRealname());
        memberSignInService.save(memberSignIn);
        return Result.OK(memberSignInService.selectLatestCycleList(loginUser.getId()));
    }
}
