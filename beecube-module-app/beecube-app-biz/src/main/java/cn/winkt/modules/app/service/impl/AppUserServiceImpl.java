package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppUser;
import cn.winkt.modules.app.mapper.AppUserMapper;
import cn.winkt.modules.app.service.IAppUserService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 应用管理员表
 * @Author: jeecg-boot
 * @Date:   2022-12-18
 * @Version: V1.0
 */
@Service
public class AppUserServiceImpl extends ServiceImpl<AppUserMapper, AppUser> implements IAppUserService {

}
