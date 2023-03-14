package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.desensitization.util.SensitiveInfoUtil;
import org.jeecg.common.system.vo.*;
import org.jeecg.common.util.oConvertUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class AppMemberProviderImpl implements AppMemberProvider {

    @Resource
    private IAppMemberService appMemberService;


    @Override
    public LoginUser getUserByName(String username) {
        if(oConvertUtils.isEmpty(username)) {
            return null;
        }
        LoginUser user = appMemberService.getEncodeUserInfo(username);

        if(user != null) {
            try {
                SensitiveInfoUtil.handlerObject(user, false);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }

        return user;
    }

}
