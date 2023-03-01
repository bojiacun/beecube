package cn.winkt.modules.app.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.constant.AppModuleConstants;
import org.jeecg.common.system.vo.DictModel;
import org.jeecg.common.system.vo.DynamicDataSourceModel;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.system.vo.SysPermissionDataRuleModel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Set;

@Component
@FeignClient(value = AppModuleConstants.SERVICE_APP, contextId = "beecube-app-app-member-provider")
@ConditionalOnMissingClass("cn.winkt.modules.app.service.impl.AppMemberProviderImpl")
public interface IAppMemberProviderApi extends AppMemberProvider {

    @GetMapping("/app/api/members/queryUserByName")
    LoginUser getUserByName(@RequestParam(name = "username", defaultValue = "") String username);

    @GetMapping("/app/api/members/queryDictItemsByCode")
    List<DictModel> queryDictItemsByCode(String code);

    @GetMapping("/app/api/members/queryPermissionDataRule")
    List<SysPermissionDataRuleModel> queryPermissionDataRule(String component, String requestPath, String username);

    @GetMapping("/app/api/members/queryUserAuths")
    Set<String> queryUserAuths(String username);


    @GetMapping("/app/api/members/queryUserRoles")
    Set<String> queryUserRoles(String username);

    @GetMapping("/app/api/members/getDynamicDbSourceByCode")
    DynamicDataSourceModel getDynamicDbSourceByCode(String dbSourceCode);

    @GetMapping("/app/api/members/translateDict")
    String translateDict(String code, String key);

    @GetMapping("/app/api/members/queryEnableDictItemsByCode")
    List<DictModel> queryEnableDictItemsByCode(String code);
}
