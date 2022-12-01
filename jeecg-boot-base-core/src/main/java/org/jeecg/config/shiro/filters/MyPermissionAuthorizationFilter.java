package org.jeecg.config.shiro.filters;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.config.shiro.JwtToken;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class MyPermissionAuthorizationFilter extends PermissionsAuthorizationFilter {

    @Override
    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws IOException {
        //在这之前先登录
        Subject subject = getSubject(request, response);
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String token = httpServletRequest.getHeader(CommonConstant.X_ACCESS_TOKEN);
        // update-begin--Author:lvdandan Date:20210105 for：JT-355 OA聊天添加token验证，获取token参数
        if (oConvertUtils.isEmpty(token)) {
            token = httpServletRequest.getParameter("token");
        }
        // update-end--Author:lvdandan Date:20210105 for：JT-355 OA聊天添加token验证，获取token参数

        JwtToken jwtToken = new JwtToken(token);
        subject.login(jwtToken);
        return super.isAccessAllowed(request, response, mappedValue);
    }

    @Override
    protected boolean onAccessDenied(ServletRequest servletRequest, ServletResponse servletResponse) throws IOException {
        log.info("当 isAccessAllowed 返回 false 的时候，才会执行 method onAccessDenied ");

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        JwtUtil.responseError(response, 403, "无权访问");
        // 返回 false 表示已经处理，例如页面跳转啥的，表示不在走以下的拦截器了（如果还有配置的话）
        return false;
    }
}
