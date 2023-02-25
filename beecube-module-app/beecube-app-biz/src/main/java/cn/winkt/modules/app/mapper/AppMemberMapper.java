package cn.winkt.modules.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.app.entity.AppMember;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 应用会员表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface AppMemberMapper extends BaseMapper<AppMember> {

    AppMember getUserByName(@Param("username") String username);
}
