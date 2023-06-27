package cn.winkt.modules.app.controller.wxapp;


import cn.winkt.modules.app.config.MiniAppPayServices;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import cn.winkt.modules.app.entity.AppMemberWithdraw;
import cn.winkt.modules.app.entity.AppPayLog;
import cn.winkt.modules.app.service.IAppMemberMoneyRecordService;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppMemberWithdrawService;
import cn.winkt.modules.app.service.IAppPayLogService;
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
@RequestMapping("/api/members/money")
public class WxAppMemberMoneyController {

    @Resource
    IAppMemberMoneyRecordService appMemberMoneyRecordService;

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
        LambdaQueryWrapper<AppMemberMoneyRecord> queryWrapper = new LambdaQueryWrapper<>();
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(type > 0) {
            queryWrapper.eq(AppMemberMoneyRecord::getType, type);
        }
        queryWrapper.eq(AppMemberMoneyRecord::getMemberId, loginUser.getId());
        queryWrapper.orderByDesc(AppMemberMoneyRecord::getCreateTime);
        queryWrapper.eq(AppMemberMoneyRecord::getStatus, 1);

        Page<AppMemberMoneyRecord> page = new Page<>(pageNo, pageSize);
        IPage<AppMemberMoneyRecord> pageList = appMemberMoneyRecordService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    /**
     * 用户充值
     * @param data
     * @return
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws WxPayException
     */
    @PutMapping("/charge")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> charge(@RequestBody JSONObject data) throws InvocationTargetException, IllegalAccessException, WxPayException {
        double amount = data.getDoubleValue("amount");
        if(amount < 0.01) {
            throw new JeecgBootException("充值金额太小");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        //充值记录
        AppMemberMoneyRecord record = new AppMemberMoneyRecord();
        record.setMoney(amount);
        record.setType(3);
        record.setMemberId(loginUser.getId());
        record.setDescription("用户充值");
        record.setStatus(0);
        record.setAppId(AppContext.getApp());
        appMemberMoneyRecordService.save(record);

        AppPayLog payLog = getPayLog(record.getId());
        AppMember member = appMemberService.getById(loginUser.getId());

        BigDecimal payAmount = BigDecimal.valueOf(amount).setScale(2, RoundingMode.HALF_DOWN);

        WxPayUnifiedOrderRequest request = WxPayUnifiedOrderRequest.newBuilder()
                .notifyUrl(jeecgBaseConfig.getDomainUrl().getApp() + "/app/api/notify/charge/" + AppContext.getApp())
                .openid(member.getWxappOpenid()).outTradeNo(payLog.getId())
                .body("用户充值")
                .spbillCreateIp("127.0.0.1")
                .totalFee(payAmount.multiply(BigDecimal.valueOf(100L)).intValue())
                .detail(StringUtils.getIfEmpty(member.getRealname(), member::getPhone))
                .build();
        WxPayService wxPayService = miniAppPayServices.getService(AppContext.getApp());
        return Result.OK("", wxPayService.createOrder(request));
    }

    @PostMapping("/withdraw")
    public Result<?> withdraw(@RequestBody JSONObject data) {
        BigDecimal amount = BigDecimal.valueOf(data.getFloatValue("amount"));
        if(amount.compareTo(BigDecimal.valueOf(0.01)) < 0) {
            throw new JeecgBootException("提现金额太小");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        AppMember member = appMemberService.getById(loginUser.getId());
        if(member.getMoney().compareTo(amount) < 0) {
            throw new JeecgBootException("您没有这么多的额度");
        }
        if(StringUtils.isEmpty(member.getPhone())) {
            throw new JeecgBootException("请绑定手机号之后再来提现");
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
