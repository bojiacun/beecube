package cn.winkt.modules.app.controller.wxapp;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.winkt.modules.app.config.WxMiniappServices;
import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppSettingService;
import cn.winkt.modules.app.vo.MemberSetting;
import com.apifan.common.random.RandomSource;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.PasswordUtil;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.config.AppContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wxapp/login")
@Slf4j
public class WxAppLoginController {

    @Resource
    WxMiniappServices wxMiniappServices;
    @Resource
    IAppMemberService appMemberService;

    @Resource
    IAppSettingService appSettingService;

    @Resource
    RedisUtil redisUtil;


    @GetMapping
    public Result<String> code2Session(@RequestParam String code, @RequestParam(defaultValue = "") String mid) throws WxErrorException {
        WxMaService wxMaService = wxMiniappServices.getService(AppContext.getApp());
        WxMaJscode2SessionResult result = wxMaService.jsCode2SessionInfo(code);
        LambdaQueryWrapper<AppMember> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMember::getWxappOpenid, result.getOpenid())
                .or()
                .eq(AppMember::getWechatUnionid, result.getUnionid());
        AppMember appMember = appMemberService.getOne(queryWrapper);
        String password = RandomSource.personInfoSource().randomStrongPassword(8, false);
        String salt = RandomSource.personInfoSource().randomStrongPassword(6,false);
        if(appMember == null) {
            appMember = new AppMember();
            appMember.setWxappOpenid(result.getOpenid());
            appMember.setWechatUnionid(result.getUnionid());
            appMember.setUsername(result.getOpenid());
            appMember.setPassword(PasswordUtil.encrypt(result.getOpenid(), password, salt));
            appMember.setStatus(1);
            //设置上分享人ID
            appMember.setShareId(mid);
            appMemberService.save(appMember);
            log.debug("新用户刚建立ID：{}，分享人ID：{}", appMember.getId(), mid);
            try {
                //新用户赠送积分
                MemberSetting memberSetting = appSettingService.queryMemberSettings(AppContext.getApp());
                BigDecimal newMemberIntegral = new BigDecimal(memberSetting.getNewMemberIntegral());
                if(newMemberIntegral.compareTo(BigDecimal.ZERO) > 0) {
                    appMemberService.inScore(appMember.getId(), newMemberIntegral, "新用户赠送积分");
                }
                BigDecimal shareIntegral = new BigDecimal(memberSetting.getShareIntegral());
                if(shareIntegral.compareTo(BigDecimal.ZERO) > 0) {
                    appMemberService.inScore(mid, shareIntegral, "分享用户获得积分");
                }
            }
            catch (Exception ex){
                log.error(ex.getMessage(), ex);
            }

        }
        //执行登录操作
        if(appMember.getStatus() == 0) {
            throw new JeecgBootException("登录失败，您的账户已被禁用");
        }
        String token = JwtUtil.sign(appMember.getUsername(), appMember.getPassword());
        redisUtil.set(AppModuleConstants.PREFIX_USER_TOKEN + token, token);
        redisUtil.expire(AppModuleConstants.PREFIX_USER_TOKEN + token, JwtUtil.EXPIRE_TIME * 2 / 1000);
        redisUtil.set(AppModuleConstants.PREFIX_USER_TOKEN + appMember.getUsername(), token);
        redisUtil.expire(AppModuleConstants.PREFIX_USER_TOKEN + appMember.getUsername(), JwtUtil.EXPIRE_TIME * 2 / 1000);
        return Result.OK(token);
    }
}
