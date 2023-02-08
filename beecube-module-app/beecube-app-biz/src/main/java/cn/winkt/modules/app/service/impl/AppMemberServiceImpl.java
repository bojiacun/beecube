package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.mapper.AppMemberMapper;
import cn.winkt.modules.app.service.IAppMemberService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class AppMemberServiceImpl extends ServiceImpl<AppMemberMapper, AppMember> implements IAppMemberService {

}
