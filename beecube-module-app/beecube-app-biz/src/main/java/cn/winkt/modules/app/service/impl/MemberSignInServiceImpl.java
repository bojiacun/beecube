package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.MemberSignIn;
import cn.winkt.modules.app.mapper.MemberSignInMapper;
import cn.winkt.modules.app.service.IMemberSignInService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 会员签到
 * @Author: jeecg-boot
 * @Date:   2023-05-21
 * @Version: V1.0
 */
@Service
public class MemberSignInServiceImpl extends ServiceImpl<MemberSignInMapper, MemberSignIn> implements IMemberSignInService {

}
