package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.entity.MemberSignIn;
import cn.winkt.modules.app.service.IMemberSignInService;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RequestMapping("/api/signin")
public class WxAppSignInController {

    @Resource
    private IMemberSignInService memberSignInService;

    /**
     * 获取当前用户的签到数据，如果断签则为空，没有断签则返回整个周期内的签到数据
     * @return
     */
    @GetMapping("/info")
    public Result<List<MemberSignIn>> mySignInInfos() {
        List<MemberSignIn> memberSignIns = memberSignInService.selectLatestCycleList();
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
}
