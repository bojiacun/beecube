package cn.winkt.modules.app.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.constant.AppModuleConstants;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.dto.DataLogDTO;
import org.jeecg.common.api.dto.OnlineAuthDTO;
import org.jeecg.common.api.dto.message.*;
import org.jeecg.common.system.vo.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@FeignClient(value = AppModuleConstants.SERVICE_APP, contextId = "beecube-app-member-provider")
@ConditionalOnMissingClass("cn.winkt.modules.app.service.impl.AppMemberProviderImpl")
@Primary
public interface IAppMemberProviderApi extends AppMemberProvider {
    /**
     * 39根据用户账号查询用户信息 CommonAPI中定义
     * @param username
     * @return LoginUser 用户信息
     */
    @Override
    @GetMapping("/app/admin/getUserByName")
    LoginUser getUserByName(@RequestParam("username") String username);
}
