package cn.winkt.modules.app.utils;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.constant.AppModuleConstants;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.CommonAPI;
import org.jeecg.common.constant.CacheConstant;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.desensitization.util.SensitiveInfoUtil;
import org.jeecg.common.exception.JeecgBoot401Exception;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.common.util.oConvertUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author scott
 * @Date 2019/9/23 14:12
 * @Description: 编程校验token有效性
 */
@Slf4j
public class AppTokenUtils {

    /**
     * 获取 request 里传递的 token
     *
     * @param request
     * @return
     */
    public static String getTokenByRequest(HttpServletRequest request) {
        String token = request.getParameter("token");
        if (token == null) {
            token = request.getHeader("X-Access-Token");
        }
        return token;
    }

    /**
     * 验证Token
     */
    public static boolean verifyToken(HttpServletRequest request, AppMemberProvider appMemberProvider, RedisUtil redisUtil) {
        log.debug(" -- url --" + request.getRequestURL());
        String token = getTokenByRequest(request);
        return verifyToken(token, appMemberProvider, redisUtil);
    }

    /**
     * 验证Token
     */
    public static boolean verifyToken(String token, AppMemberProvider appMemberProvider, RedisUtil redisUtil) {
        if (StringUtils.isBlank(token)) {
            throw new JeecgBoot401Exception("token不能为空!");
        }

        // 解密获得username，用于和数据库进行对比
        String username = JwtUtil.getUsername(token);
        if (username == null) {
            throw new JeecgBoot401Exception("token非法无效!");
        }

        // 查询用户信息
        LoginUser user = AppTokenUtils.getLoginUser(username, appMemberProvider, redisUtil);
        //LoginUser user = commonApi.getUserByName(username);
        if (user == null) {
            throw new JeecgBoot401Exception("用户不存在!");
        }
        // 判断用户状态
        if (user.getStatus() != 1) {
            throw new JeecgBoot401Exception("账号已被锁定,请联系管理员!");
        }
        // 校验token是否超时失效 & 或者账号密码是否错误
        if (!jwtTokenRefresh(token, username, user.getPassword(), redisUtil)) {
            throw new JeecgBoot401Exception(CommonConstant.TOKEN_IS_INVALID_MSG);
        }
        return true;
    }

    /**
     * 刷新token（保证用户在线操作不掉线）
     * @param token
     * @param userName
     * @param passWord
     * @param redisUtil
     * @return
     */
    private static boolean jwtTokenRefresh(String token, String userName, String passWord, RedisUtil redisUtil) {
        String cacheToken = oConvertUtils.getString(redisUtil.get(AppModuleConstants.APP_USERS_CACHE + token));
        if (oConvertUtils.isNotEmpty(cacheToken)) {
            // 校验token有效性
            if (!JwtUtil.verify(cacheToken, userName, passWord)) {
                String newAuthorization = JwtUtil.sign(userName, passWord);
                // 设置Toekn缓存有效时间
                redisUtil.set(AppModuleConstants.PREFIX_USER_TOKEN + token, newAuthorization);
                redisUtil.expire(AppModuleConstants.PREFIX_USER_TOKEN + token, JwtUtil.EXPIRE_TIME * 2 / 1000);
                redisUtil.set(AppModuleConstants.PREFIX_USER_TOKEN + userName, newAuthorization);
                redisUtil.expire(AppModuleConstants.PREFIX_USER_TOKEN + userName, JwtUtil.EXPIRE_TIME *2 / 1000);
            }
            return true;
        }
        return false;
    }

    /**
     * 获取登录用户
     *
     * @param username
     * @return
     */
    private static LoginUser getLoginUser(String username, AppMemberProvider appMemberProvider, RedisUtil redisUtil) {
        LoginUser loginUser = null;
        String loginUserKey = AppModuleConstants.APP_USERS_CACHE + "::" + username;
        //【重要】此处通过redis原生获取缓存用户，是为了解决微服务下system服务挂了，其他服务互调不通问题---
        if (redisUtil.hasKey(loginUserKey)) {
            log.info("缓存中有用户信息 {}", username);
            try {
                loginUser = (LoginUser) redisUtil.get(loginUserKey);
                //解密用户
                SensitiveInfoUtil.handlerObject(loginUser, false);
            } catch (IllegalAccessException e) {
                log.error(e.getMessage(), e);
            }
        } else {
            // 查询用户信息
            log.info("缓存中没有APP用户信息，从数据库中去查找 {}", username);
            loginUser = appMemberProvider.getUserByName(username);
        }
        return loginUser;
    }
}
