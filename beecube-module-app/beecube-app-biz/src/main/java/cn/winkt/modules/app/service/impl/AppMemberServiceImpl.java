package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.mapper.AppMemberMapper;
import cn.winkt.modules.app.service.IAppMemberService;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.desensitization.annotation.SensitiveEncode;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.config.AppContext;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Service
public class AppMemberServiceImpl extends ServiceImpl<AppMemberMapper, AppMember> implements IAppMemberService {


    @Resource
    AppMemberMapper appMemberMapper;


    @Override
    @SensitiveEncode
    @Cacheable(cacheNames= AppModuleConstants.APP_USERS_CACHE, key="#username", unless = "#result == null")
    public LoginUser getEncodeUserInfo(String username) {
        if(oConvertUtils.isEmpty(username)) {
            return null;
        }
        LoginUser loginUser = new LoginUser();
        log.info("从数据库中查找用户信息 {}, {}", username, AppContext.getApp());
        AppMember appMember = appMemberMapper.getUserByName(username);
        if(appMember == null) {
            return null;
        }
        loginUser.setId(appMember.getId());
        loginUser.setSex(appMember.getSex());
        loginUser.setAvatar(appMember.getAvatar());
        loginUser.setPhone(appMember.getPhone());
        loginUser.setStatus(appMember.getStatus());
        loginUser.setEmail(appMember.getEmail());
        loginUser.setUsername(appMember.getUsername());
        loginUser.setPassword(appMember.getPassword());
        loginUser.setCreateTime(appMember.getCreateTime());
        loginUser.setRealname(appMember.getRealname());
        return loginUser;
    }
}
