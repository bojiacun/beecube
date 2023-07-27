package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.constant.AppConstant;
import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberRegister;
import cn.winkt.modules.app.entity.AppMemberScoreRecord;
import cn.winkt.modules.app.mapper.AppMemberMapper;
import cn.winkt.modules.app.mapper.AppMemberRegisterMapper;
import cn.winkt.modules.app.service.IAppMemberRegisterService;
import cn.winkt.modules.app.service.IAppMemberScoreRecordService;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.boot.starter.lock.annotation.JLock;
import org.jeecg.common.desensitization.annotation.SensitiveEncode;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.config.AppContext;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
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
public class AppMemberRegisterServiceImpl extends ServiceImpl<AppMemberRegisterMapper, AppMemberRegister> implements IAppMemberRegisterService {
}
