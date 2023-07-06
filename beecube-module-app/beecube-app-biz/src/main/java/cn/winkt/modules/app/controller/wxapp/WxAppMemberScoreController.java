package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.config.MiniAppPayServices;
import cn.winkt.modules.app.entity.*;
import cn.winkt.modules.app.service.*;
import cn.winkt.modules.app.vo.MemberSetting;
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
import java.util.List;

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
    IAppSettingService appSettingService;

    @Resource
    JeecgBaseConfig jeecgBaseConfig;
    @Resource
    MiniAppPayServices miniAppPayServices;

    @Resource
    IAppMemberWithdrawService appMemberWithdrawService;

    @Resource
    IAppMemberShareRecordService appMemberShareRecordService;

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


    /**
     * 转发朋友圈获或者微信好友立即增加积分，不管有么有成功
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    @PostMapping("/share")
    public Result<?> newShareScore() throws InvocationTargetException, IllegalAccessException {
        MemberSetting memberSetting = appSettingService.queryMemberSettings();
        if(StringUtils.isNumeric(memberSetting.getShareTimelineIntegral())) {
            BigDecimal shareTimelineIntegral = new BigDecimal(memberSetting.getShareTimelineIntegral()).setScale(2, RoundingMode.CEILING);
            if(shareTimelineIntegral.compareTo(BigDecimal.ZERO) > 0) {
                LambdaQueryWrapper<AppMemberShareRecord> queryWrapper = new LambdaQueryWrapper<>();
                List<AppMemberShareRecord> shareRecords = appMemberShareRecordService.list(queryWrapper);
                BigDecimal maxDayShare = BigDecimal.ZERO;
                BigDecimal todaySharedScore = BigDecimal.ZERO;
                if(StringUtils.isNumeric(memberSetting.getMaxDayShareTimelineIntegral())) {
                    maxDayShare = maxDayShare.add(new BigDecimal(memberSetting.getMaxDayShareTimelineIntegral()).setScale(2, RoundingMode.CEILING));
                }
                for (AppMemberShareRecord record : shareRecords) {
                    todaySharedScore = todaySharedScore.add(record.getScore());
                }
                if(maxDayShare.compareTo(BigDecimal.ZERO) == 0 || todaySharedScore.compareTo(maxDayShare) < 0) {
                    AppMemberShareRecord record = new AppMemberShareRecord();
                    record.setScore(shareTimelineIntegral);
                    LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
                    record.setMemberId(loginUser.getId());
                    appMemberShareRecordService.save(record);
                }
            }
        }
        return Result.OK("调用成功");
    }

    @PostMapping("/withdraw")
    public Result<?> withdraw(@RequestBody JSONObject data) throws InvocationTargetException, IllegalAccessException {
        MemberSetting memberSetting = appSettingService.queryMemberSettings();
        BigDecimal amount = BigDecimal.valueOf(data.getFloatValue("amount"));
        if(amount.compareTo(new BigDecimal(memberSetting.getMinWithdrawIntegral())) < 0) {
            throw new JeecgBootException(String.format("最低%s起步，才可提现", memberSetting.getMinWithdrawIntegral()));
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMember member = appMemberService.getById(loginUser.getId());
        if(member.getScore().compareTo(amount) < 0) {
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
        appMemberWithdraw.setAmount(amount.setScale(2, RoundingMode.CEILING).divide(BigDecimal.valueOf(100), RoundingMode.CEILING));
        appMemberWithdraw.setMemberId(member.getId());
        appMemberWithdraw.setMemberPhone(member.getPhone());
        appMemberWithdraw.setMemberName(StringUtils.getIfEmpty(member.getRealname(), member::getNickname));
        appMemberWithdraw.setAppId(AppContext.getApp());
        appMemberWithdraw.setType(2);
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
