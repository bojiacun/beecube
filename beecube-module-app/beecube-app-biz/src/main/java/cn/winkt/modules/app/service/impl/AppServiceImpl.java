package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.mapper.AppMapper;
import cn.winkt.modules.app.service.IAppService;
import cn.winkt.modules.app.vo.AppDTO;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 应用实体类
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Service
public class AppServiceImpl extends ServiceImpl<AppMapper, App> implements IAppService {
    @Resource
    private AppMapper appMapper;
    @Override
    public IPage<AppDTO> selectPageJoinAppModule(IPage<AppDTO> page, Wrapper<App> queryWrapper) {
        return appMapper.selectPageJoinAppModule(page, queryWrapper);
    }
}
