package cn.winkt.modules.app.controller.api;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.winkt.modules.app.config.WxMiniappServices;
import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.apifan.common.random.RandomSource;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.RandomUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.es.QueryStringBuilder;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.CommonUtils;
import org.jeecg.common.util.PasswordUtil;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.config.AppContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/app/api/wxapp/login")
public class AppApiWxappLoginController {

    @Resource
    WxMiniappServices wxMiniappServices;
    @Resource
    IAppMemberService appMemberService;

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
        }
        //执行登录操作
        if(appMember.getStatus() == 0)  {
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
