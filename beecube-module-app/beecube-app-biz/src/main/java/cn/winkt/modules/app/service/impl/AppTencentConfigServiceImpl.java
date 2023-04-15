package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppTencentConfig;
import cn.winkt.modules.app.entity.AppWxOpenConfig;
import cn.winkt.modules.app.mapper.AppTencentConfigMapper;
import cn.winkt.modules.app.mapper.AppWxOpenConfigMapper;
import cn.winkt.modules.app.service.IAppTencentConfigService;
import cn.winkt.modules.app.service.IAppWxOpenConfigService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * @Description: 微信开放平台配置表
 * @Author: jeecg-boot
 * @Date:   2023-04-01
 * @Version: V1.0
 */
@Service
public class AppTencentConfigServiceImpl extends ServiceImpl<AppTencentConfigMapper, AppTencentConfig> implements IAppTencentConfigService {

}
