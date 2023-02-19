package cn.winkt.modules.app.config;

import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.config.TenantContext;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.config.AppContext;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
public class WebAppIdInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) throws Exception {

        String tenantId = request.getHeader(CommonConstant.TENANT_ID);
        TenantContext.setTenant(tenantId);

        String appId = request.getHeader(CommonConstant.X_APP_ID);
        AppContext.setApp(appId);

        log.info("设置Header中的AppId和TenantId {} {}", appId, tenantId);
        return true;
    }
}
