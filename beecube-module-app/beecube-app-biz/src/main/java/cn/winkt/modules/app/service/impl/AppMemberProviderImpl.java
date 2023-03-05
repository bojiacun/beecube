package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.desensitization.util.SensitiveInfoUtil;
import org.jeecg.common.system.vo.*;
import org.jeecg.common.util.oConvertUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class AppMemberProviderImpl implements AppMemberProvider {

    @Resource
    private IAppMemberService appMemberService;

    @Resource
    private SystemApi systemApi;

    @Override
    public Set<String> queryUserRoles(String username) {
        return null;
    }

    @Override
    public Set<String> queryUserAuths(String username) {
        return null;
    }

    @Override
    public DynamicDataSourceModel getDynamicDbSourceById(String dbSourceId) {
        return null;
    }

    @Override
    public DynamicDataSourceModel getDynamicDbSourceByCode(String dbSourceCode) {
        return null;
    }

    @Override
    public LoginUser getUserByName(String username) {
        if(oConvertUtils.isEmpty(username)) {
            return null;
        }
        LoginUser user = appMemberService.getEncodeUserInfo(username);

        try {
            SensitiveInfoUtil.handlerObject(user, false);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        return user;
    }

    @Override
    public String translateDictFromTable(String table, String text, String code, String key) {
        return systemApi.translateDictFromTable(table, text, code, key);
    }

    @Override
    public String translateDict(String code, String key) {
        return systemApi.translateDict(code, key);
    }

    @Override
    public List<SysPermissionDataRuleModel> queryPermissionDataRule(String component, String requestPath, String username) {
        return null;
    }

    @Override
    public SysUserCacheInfo getCacheUser(String username) {
        return null;
    }

    @Override
    public List<DictModel> queryDictItemsByCode(String code) {
        return systemApi.queryDictItemsByCode(code);
    }

    @Override
    public List<DictModel> queryEnableDictItemsByCode(String code) {
        return systemApi.queryEnableDictItemsByCode(code);
    }

    @Override
    public List<DictModel> queryTableDictItemsByCode(String table, String text, String code) {
        return systemApi.queryTableDictItemsByCode(table, text, code);
    }

    @Override
    public Map<String, List<DictModel>> translateManyDict(String dictCodes, String keys) {
        return systemApi.translateManyDict(dictCodes, keys);
    }

    @Override
    public List<DictModel> translateDictFromTableByKeys(String table, String text, String code, String keys) {
        return systemApi.translateDictFromTableByKeys(table, text, code, keys);
    }
}
