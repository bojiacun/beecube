package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.DayTask;
import cn.winkt.modules.paimai.mapper.DayTaskMapper;
import cn.winkt.modules.paimai.service.IDayTaskService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.DateUtils;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 拍卖任务表
 * @Author: jeecg-boot
 * @Date:   2023-05-28
 * @Version: V1.0
 */
@Service
public class DayTaskServiceImpl extends ServiceImpl<DayTaskMapper, DayTask> implements IDayTaskService {

    @Resource
    private DayTaskMapper dayTaskMapper;

    @Override
    public boolean todayTasked(int type) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser == null) {
            return true;
        }
        QueryWrapper<DayTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.le("create_time", DateUtils.todayEndTime());
        queryWrapper.ge("create_time", DateUtils.todayZeroTime());
        queryWrapper.eq("type", type);
        queryWrapper.eq("member_id", loginUser.getId());
        return dayTaskMapper.selectCount(queryWrapper) > 0;
    }

    @Override
    public void saveTask(int type) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser == null) {
            return;
        }
        DayTask dayTask = new DayTask();
        dayTask.setType(type);
        dayTask.setMemberAvatar(loginUser.getAvatar());
        dayTask.setMemberName(loginUser.getRealname());
        dayTask.setMemberId(loginUser.getId());
        dayTaskMapper.insert(dayTask);
    }
}
