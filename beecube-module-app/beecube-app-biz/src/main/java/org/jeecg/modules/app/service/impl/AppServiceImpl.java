package org.jeecg.modules.app.service.impl;

import org.jeecg.modules.app.entity.App;
import org.jeecg.modules.app.mapper.AppMapper;
import org.jeecg.modules.app.service.IAppService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 应用实体类
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Service
public class AppServiceImpl extends ServiceImpl<AppMapper, App> implements IAppService {

}
