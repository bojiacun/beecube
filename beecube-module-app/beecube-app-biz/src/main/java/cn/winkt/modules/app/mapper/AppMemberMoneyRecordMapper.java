package cn.winkt.modules.app.mapper;

import java.util.List;

import cn.winkt.modules.app.vo.WithdrawDTO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 应用会员余额记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
public interface AppMemberMoneyRecordMapper extends BaseMapper<AppMemberMoneyRecord> {
    IPage<WithdrawDTO> selectPageDTO(Page<AppMemberMoneyRecord> page, @Param(Constants.WRAPPER) QueryWrapper<AppMemberMoneyRecord> queryWrapper);
}
