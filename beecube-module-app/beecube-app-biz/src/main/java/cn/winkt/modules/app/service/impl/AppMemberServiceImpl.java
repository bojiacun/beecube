package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.mapper.AppMemberMapper;
import cn.winkt.modules.app.service.IAppMemberService;
import org.jeecg.common.constant.CacheConstant;
import org.jeecg.common.desensitization.annotation.SensitiveEncode;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class AppMemberServiceImpl extends ServiceImpl<AppMemberMapper, AppMember> implements IAppMemberService {


    @Resource
    AppMemberMapper appMemberMapper;


    @Override
    @Cacheable(cacheNames= CacheConstant.SYS_USERS_CACHE, key="#username")
    @SensitiveEncode
    public LoginUser getEncodeUserInfo(String username) {
        if(oConvertUtils.isEmpty(username)) {
            return null;
        }
        LoginUser loginUser = new LoginUser();
        AppMember appMember = appMemberMapper.getUserByName(username);
        if(appMember == null) {
            return null;
        }
        BeanUtils.copyProperties(loginUser, appMember);
        return loginUser;
    }
}
