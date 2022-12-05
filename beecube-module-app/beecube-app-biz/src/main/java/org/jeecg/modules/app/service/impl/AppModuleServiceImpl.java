package org.jeecg.modules.app.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.jeecg.modules.app.entity.AppModule;
import org.jeecg.modules.app.mapper.AppModuleMapper;
import org.jeecg.modules.app.service.IAppModuleService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

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
