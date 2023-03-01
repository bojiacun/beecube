package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.CacheConstant;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.DictModel;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.system.vo.SysPermissionDataRuleModel;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;

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


    @PutMapping("/update")
    @CacheEvict(value = CacheConstant.SYS_USERS_CACHE, allEntries = true)
    public Result<AppMember> updateMember(@RequestBody AppMember appMember) {
        AppMember old = appMemberService.getById(appMember.getId());
        if(old == null) {
            throw new JeecgBootException("更新失败,未找到用户信息");
        }
        LambdaUpdateWrapper<AppMember> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        lambdaUpdateWrapper
                .set(AppMember::getNickname, appMember.getNickname())
                .set(AppMember::getPhone, appMember.getPhone())
                .set(AppMember::getAvatar, appMember.getAvatar())
                .set(AppMember::getEmail, appMember.getEmail())
                .set(AppMember::getRealname, appMember.getRealname())
                .set(AppMember::getSex, appMember.getSex())
                .set(AppMember::getCardFace, appMember.getCardFace())
                .set(AppMember::getCardBack, appMember.getCardBack())
                .set(AppMember::getIdCard, appMember.getIdCard())
                .eq(AppMember::getId, old.getId());

        //使命认真
        if(StringUtils.isAnyEmpty(appMember.getCardBack(), appMember.getCardFace(), appMember.getRealname())) {
           lambdaUpdateWrapper.set(AppMember::getAuthStatus, 0);
        }
        else {
            lambdaUpdateWrapper.set(AppMember::getAuthStatus, 1);
        }
        appMemberService.update(lambdaUpdateWrapper);
        return Result.OK(appMemberService.getById(appMember.getId()));
    }
}
