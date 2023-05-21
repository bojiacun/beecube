package cn.winkt.modules.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.app.entity.MemberSignIn;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 会员签到
 * @Author: jeecg-boot
 * @Date:   2023-05-21
 * @Version: V1.0
 */
public interface MemberSignInMapper extends BaseMapper<MemberSignIn> {
    List<MemberSignIn> selectLatestCycleList(@Param("memberId") String memberId);
}
