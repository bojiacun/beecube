package cn.winkt.modules.app.service;

import cn.winkt.modules.app.entity.AppModuleRole;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 模块路由映射表
 * @Author: jeecg-boot
 * @Date:   2022-12-17
 * @Version: V1.0
 */
public interface IAppModuleRoleService extends IService<AppModuleRole> {
    /**
     * 获取模块对应的预留角色
     * @param moduleId
     * @return
     */
    AppModuleRole getRoleByModuleId(String moduleId);
}
