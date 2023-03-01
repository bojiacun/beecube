package cn.winkt.modules.app.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.constant.AppModuleConstants;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient(value = AppModuleConstants.SERVICE_APP, contextId = "beecube-app-app-member-provider")
@ConditionalOnMissingClass("cn.winkt.modules.app.service.impl.AppMemberProviderImpl")
public interface IAppMemberProviderApi extends AppMemberProvider {

    @GetMapping("/app/members")
    LoginUser getUserByName(@RequestParam(name = "username", defaultValue = "") String username);
}
