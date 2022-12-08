package cn.winkt.modules.app.service;

import cn.winkt.modules.app.entity.AppModule;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 应用模块
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
public interface IAppModuleService extends IService<AppModule> {
    AppModule queryByIdentify(String identify);
}
