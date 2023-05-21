package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.constant.AppConstant;
import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberScoreRecord;
import cn.winkt.modules.app.mapper.AppMemberMapper;
import cn.winkt.modules.app.service.IAppMemberScoreRecordService;
import cn.winkt.modules.app.service.IAppMemberService;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.boot.starter.lock.annotation.JLock;
import org.jeecg.common.desensitization.annotation.SensitiveEncode;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.config.AppContext;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;

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

    @Resource
    IAppMemberScoreRecordService appMemberScoreRecordService;

    @Override
    @SensitiveEncode
    @Cacheable(cacheNames= AppModuleConstants.APP_USERS_CACHE, key="#username", unless = "#result == null")
    public LoginUser getEncodeUserInfo(String username) {
        if(oConvertUtils.isEmpty(username)) {
            return null;
        }
        LoginUser loginUser = new LoginUser();
        log.debug("从数据库中查找用户信息 {}, {}", username, AppContext.getApp());
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
        loginUser.setNickname(appMember.getNickname());
        return loginUser;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @JLock(lockKey = AppConstant.APP_MEMBER_SCORE_LOCK)
    public void inScore(String memberId, BigDecimal amount, String description) {
        AppMemberScoreRecord record = new AppMemberScoreRecord();
        record.setType(1);
        record.setMemberId(memberId);
        record.setDescription(description);
        record.setScore(amount);
        AppMember appMember = appMemberMapper.selectById(memberId);
        appMember.setScore(appMember.getScore().add(amount));
        appMemberMapper.updateById(appMember);
        appMemberScoreRecordService.save(record);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @JLock(lockKey = AppConstant.APP_MEMBER_SCORE_LOCK)
    public void outScore(String memberId, BigDecimal amount, String description) {
        AppMember appMember = appMemberMapper.selectById(memberId);
        if(appMember.getScore().compareTo(amount) < 0) {
            throw new JeecgBootException("积分不足");
        }
        AppMemberScoreRecord record = new AppMemberScoreRecord();
        record.setType(2);
        record.setMemberId(memberId);
        record.setDescription(description);
        record.setScore(amount);
        appMember.setScore(appMember.getScore().subtract(amount));
        appMemberMapper.updateById(appMember);
        appMemberScoreRecordService.save(record);
    }
}
