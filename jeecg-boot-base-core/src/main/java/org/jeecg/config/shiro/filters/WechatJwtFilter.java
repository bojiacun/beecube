package org.jeecg.config.shiro.filters;

import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.config.shiro.JwtToken;
import org.jeecg.config.shiro.LoginType;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

@Slf4j
public class WechatJwtFilter extends JwtFilter{

    @Override
    protected boolean executeLogin(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String token = httpServletRequest.getHeader(CommonConstant.X_ACCESS_TOKEN);
        // update-begin--Author:lvdandan Date:20210105 for：JT-355 OA聊天添加token验证，获取token参数
        if (oConvertUtils.isEmpty(token)) {
            token = httpServletRequest.getParameter("token");
        }
        // update-end--Author:lvdandan Date:20210105 for：JT-355 OA聊天添加token验证，获取token参数

        JwtToken jwtToken = new JwtToken(token, LoginType.App);
        // 提交给realm进行登入，如果错误他会抛出异常并被捕获
        getSubject(request, response).login(jwtToken);
        // 如果没有抛出异常则代表登入成功，返回true
        return true;
    }
}
