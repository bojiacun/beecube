package cn.winkt.modules.app.service;

import cn.winkt.modules.app.entity.MemberSignIn;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * @Description: 会员签到
 * @Author: jeecg-boot
 * @Date:   2023-05-21
 * @Version: V1.0
 */
public interface IMemberSignInService extends IService<MemberSignIn> {

    List<MemberSignIn> selectLatestCycleList(String memberId);
}
