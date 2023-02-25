package cn.winkt.modules.app.service;

import cn.winkt.modules.app.entity.AppMember;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.common.system.vo.LoginUser;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface IAppMemberService extends IService<AppMember> {
    LoginUser getEncodeUserInfo(String username);
}
