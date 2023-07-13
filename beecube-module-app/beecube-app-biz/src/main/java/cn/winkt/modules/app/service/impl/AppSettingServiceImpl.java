package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.mapper.AppSettingMapper;
import cn.winkt.modules.app.service.IAppSettingService;
import cn.winkt.modules.app.vo.AppSettingVO;
import cn.winkt.modules.app.vo.MemberSetting;
import cn.winkt.modules.app.vo.WxAppSetting;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.commons.beanutils.BeanUtils;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @Description: 应用配置表
 * @Author: jeecg-boot
 * @Date:   2022-12-19
 * @Version: V1.0
 */
@Service
public class AppSettingServiceImpl extends ServiceImpl<AppSettingMapper, AppSetting> implements IAppSettingService {

    @Resource
    AppSettingMapper appSettingMapper;

    @Override
    public MemberSetting queryMemberSettings(String appId) throws InvocationTargetException, IllegalAccessException {
        QueryWrapper<AppSetting> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("group_key", "member");
        queryWrapper.eq("app_id", appId);
        List<AppSetting> settings = appSettingMapper.selectList(queryWrapper);
        Map<String, String> configs = settings.stream()
                .filter(setting -> setting != null && setting.getSettingValue() != null)
                .collect(Collectors.toMap(AppSetting::getSettingKey, AppSetting::getSettingValue));
        MemberSetting memberSetting = new MemberSetting();
        BeanUtils.populate(memberSetting, configs);
        return memberSetting;
    }
}
