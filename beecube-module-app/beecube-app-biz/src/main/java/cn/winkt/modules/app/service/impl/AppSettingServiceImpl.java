package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.mapper.AppSettingMapper;
import cn.winkt.modules.app.service.IAppSettingService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 应用配置表
 * @Author: jeecg-boot
 * @Date:   2022-12-19
 * @Version: V1.0
 */
@Service
public class AppSettingServiceImpl extends ServiceImpl<AppSettingMapper, AppSetting> implements IAppSettingService {

}
