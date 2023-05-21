package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.config.MiniAppPayServices;
import cn.winkt.modules.app.entity.*;
import cn.winkt.modules.app.service.*;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/members/scores")
public class WxAppMemberScoreController {

    @Resource
    IAppMemberScoreRecordService appMemberScoreRecordService;

    @Resource
    IAppPayLogService appPayLogService;

    @Resource
    IAppMemberService appMemberService;

    @Resource
    JeecgBaseConfig jeecgBaseConfig;
    @Resource
    MiniAppPayServices miniAppPayServices;

    @Resource
    IAppMemberWithdrawService appMemberWithdrawService;

    @GetMapping(value = "/records")
    public Result<?> queryPageList(@RequestParam(name = "type", defaultValue = "0") Integer type,
                                   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize
                                   ) {
        LambdaQueryWrapper<AppMemberScoreRecord> queryWrapper = new LambdaQueryWrapper<>();
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        queryWrapper.eq(AppMemberScoreRecord::getMemberId, loginUser.getId());
        queryWrapper.orderByDesc(AppMemberScoreRecord::getCreateTime);

        Page<AppMemberScoreRecord> page = new Page<>(pageNo, pageSize);
        IPage<AppMemberScoreRecord> pageList = appMemberScoreRecordService.page(page, queryWrapper);
        return Result.OK(pageList);
    }


    @PostMapping("/withdraw")
    public Result<?> withdraw(@RequestBody JSONObject data) {
        float amount = data.getFloatValue("amount");
        if(amount < 0.01) {
            throw new JeecgBootException("提现金额太小");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMember member = appMemberService.getById(loginUser.getId());
        if(BigDecimal.valueOf(member.getMoney()).compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new JeecgBootException("您没有这么多的额度");
        }
        LambdaQueryWrapper<AppMemberWithdraw> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMemberWithdraw::getMemberId, loginUser.getId());
        queryWrapper.eq(AppMemberWithdraw::getStatus, 0);

        long exits = appMemberWithdrawService.count(queryWrapper);
        if(exits > 0) {
            throw new JeecgBootException("已申请提现");
        }
        AppMemberWithdraw appMemberWithdraw = new AppMemberWithdraw();
        appMemberWithdraw.setMemberId(loginUser.getId());
        appMemberWithdraw.setAmount(amount);
        appMemberWithdraw.setMemberId(member.getId());
        appMemberWithdraw.setMemberPhone(member.getPhone());
        appMemberWithdraw.setMemberName(StringUtils.getIfEmpty(member.getRealname(), member::getNickname));
        appMemberWithdraw.setAppId(AppContext.getApp());
        appMemberWithdrawService.save(appMemberWithdraw);
        return Result.OK("申请成功");
    }

    protected AppPayLog getPayLog(String ordersn) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppPayLog payLog = new AppPayLog();
        payLog.setOrdersn(ordersn);
        payLog.setOrderType(1);
        payLog.setMemberId(loginUser.getId());
        appPayLogService.save(payLog);
        return payLog;
    }
}
