package cn.winkt.modules.app.service;

import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.vo.MemberSetting;
import com.baomidou.mybatisplus.extension.service.IService;

import java.lang.reflect.InvocationTargetException;

/**
 * @Description: 应用配置表
 * @Author: jeecg-boot
 * @Date:   2022-12-19
 * @Version: V1.0
 */
public interface IAppSettingService extends IService<AppSetting> {

    MemberSetting queryMemberSettings() throws InvocationTargetException, IllegalAccessException;
}
