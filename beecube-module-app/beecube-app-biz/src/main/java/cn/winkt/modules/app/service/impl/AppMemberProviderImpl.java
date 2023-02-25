package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.desensitization.util.SensitiveInfoUtil;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Slf4j
@Service
public class AppMemberProviderImpl extends AppMemberProvider {

    @Resource
    private IAppMemberService appMemberService;

    @Override
    public LoginUser getUserByName(String username) {
        if(oConvertUtils.isEmpty(username)) {
            return null;
        }
        LoginUser user = appMemberService.getEncodeUserInfo(username);

        try {
            SensitiveInfoUtil.handlerObject(user, false);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        return user;
    }
}
