package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Slf4j
@Service
public class AppMemberProviderImpl extends AppMemberProvider {

    @Resource
    private IAppMemberService appMemberService;

    @Override
    public LoginUser getUserByName(String username) {
        LambdaQueryWrapper<AppMember> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMember::getUsername, username);
        AppMember member = appMemberService.getOne(queryWrapper);
        if(member == null) {
            return null;
        }
        LoginUser loginUser = new LoginUser();
        loginUser.setEmail(member.getEmail());
        loginUser.setPhone(member.getMobile());
        loginUser.setAvatar(member.getAvatar());
        loginUser.setUsername(member.getUsername());
        loginUser.setSex(member.getSex());
        loginUser.setStatus(member.getStatus());
        return loginUser;
    }
}
