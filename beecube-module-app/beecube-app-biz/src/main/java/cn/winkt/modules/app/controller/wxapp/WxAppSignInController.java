package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.MemberSignIn;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppSettingService;
import cn.winkt.modules.app.service.IMemberSignInService;
import cn.winkt.modules.app.vo.MemberSetting;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/signin")
public class WxAppSignInController {

    @Resource
    private IMemberSignInService memberSignInService;

    @Resource
    private IAppMemberService appMemberService;

    @Resource
    private IAppSettingService appSettingService;

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

        Date latestTime = memberSignIns.get(memberSignIns.size() - 1).getCreateTime();
        if(!isContinue(latestTime)) {
            return Result.OK(Collections.emptyList());
        }
        return Result.OK(memberSignIns);
    }
    @PostMapping
    public Result<List<MemberSignIn>> signinToday() throws InvocationTargetException, IllegalAccessException {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMember appMember = appMemberService.getById(loginUser.getId());
        List<MemberSignIn> memberSignIns = memberSignInService.selectLatestCycleList(loginUser.getId());
        if(memberSignIns.size() > 0) {
            Date latestTime = memberSignIns.get(memberSignIns.size() - 1).getCreateTime();
            if (DateUtils.isSameDay(latestTime, new Date())) {
                throw new JeecgBootException("今日已签到");
            }
            if(!isContinue(latestTime)) {
                memberSignIns = new ArrayList<>();
            }
        }
        MemberSetting memberSetting = appSettingService.queryMemberSettings();
        int cycle = memberSetting.getSigninCycle().split(",").length;
        MemberSignIn memberSignIn = new MemberSignIn();
        memberSignIn.setMemberId(loginUser.getId());
        memberSignIn.setDayIndex(memberSignIns.size() >= cycle ? 1 : memberSignIns.size()+1);
        memberSignIn.setMemberName(StringUtils.getIfEmpty(appMember.getRealname(), appMember::getNickname));
        memberSignIn.setMemberAvatar(appMember.getRealname());
        memberSignInService.save(memberSignIn);
        appMemberService.inScore(loginUser.getId(), new BigDecimal(memberSetting.getSigninCycle().split(",")[memberSignIn.getDayIndex()-1]), "签到获取积分");
        return Result.OK(memberSignInService.selectLatestCycleList(loginUser.getId()));
    }

    private boolean isContinue(Date latestDate) {
        if(DateUtils.isSameDay(latestDate, new Date())) {
            return true;
        }
        return DateUtils.isSameDay(DateUtils.addDays(latestDate, 1), new Date());
    }
}
