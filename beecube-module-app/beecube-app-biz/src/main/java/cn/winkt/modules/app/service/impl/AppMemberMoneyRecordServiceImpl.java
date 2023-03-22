package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import cn.winkt.modules.app.mapper.AppMemberMoneyRecordMapper;
import cn.winkt.modules.app.service.IAppMemberMoneyRecordService;
import cn.winkt.modules.app.vo.WithdrawDTO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 应用会员余额记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class AppMemberMoneyRecordServiceImpl extends ServiceImpl<AppMemberMoneyRecordMapper, AppMemberMoneyRecord> implements IAppMemberMoneyRecordService {

    @Resource
    AppMemberMoneyRecordMapper appMemberMoneyRecordMapper;

    @Override
    public IPage<WithdrawDTO> selectPageDTO(Page<AppMemberMoneyRecord> page, QueryWrapper<AppMemberMoneyRecord> queryWrapper) {
        return appMemberMoneyRecordMapper.selectPageDTO(page, queryWrapper);
    }
}
