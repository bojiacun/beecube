package cn.winkt.modules.app.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import cn.winkt.modules.app.entity.AppModule;
import cn.winkt.modules.app.mapper.AppModuleMapper;
import cn.winkt.modules.app.service.IAppModuleService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 应用模块
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Service
public class AppModuleServiceImpl extends ServiceImpl<AppModuleMapper, AppModule> implements IAppModuleService {


    @Override
    public AppModule queryByIdentify(String identify) {
        return this.getOne(new LambdaQueryWrapper<AppModule>().eq(AppModule::getIdentify, identify));
    }
}
