package cn.winkt.modules.paimai.service.im;

import cn.winkt.modules.paimai.service.im.message.BaseMessage;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import net.x52im.mobileimsdk.java.core.LocalDataSender;
import net.x52im.mobileimsdk.server.protocal.c.PLoginInfo;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.config.AppContext;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Observable;
import java.util.Observer;

@Service
@Slf4j
public class ImClientService {
    @Resource
    IMClientManager imClientManager;


    public void sendMessage(BaseMessage message, int typeu) {
        ServletRequestAttributes servletRequestAttributes =  (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();

        String appId = AppContext.getApp();
        String token = request.getHeader(CommonConstant.X_ACCESS_TOKEN);
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        String userId = loginUser.getId();

        //后台管理员发送消息必须登录
        imClientManager.getBaseEventListener().setLoginOkForLaunchObserver(new Observer() {
            @Override
            public void update(Observable o, Object arg) {
                //登录成功之后发送消息
                int code = (Integer)arg;
                // 登陆成功
                if(code == 0)
                {
                    new LocalDataSender.SendCommonDataAsync(JSONObject.toJSONString(message), "0", typeu) {
                        @Override
                        protected void onPostExecute(Integer integer) {
                            if(integer == 0) {
                                log.debug("数据已发出");
                            }
                            else {
                                log.error("数据发送失败");
                            }
                            LocalDataSender.getInstance().sendLoginout();
                        }
                    }.execute();
                }
                else {
                    log.error("用户 {} 登录失败", userId);
                }
            }
        });

        LoginExtraInfo loginExtraInfo = new LoginExtraInfo();
        loginExtraInfo.setAppId(appId);
        loginExtraInfo.setLoginType(2);
        PLoginInfo pLoginInfo = new PLoginInfo(userId, token, JSONObject.toJSONString(loginExtraInfo));

        new LocalDataSender.SendLoginDataAsync(pLoginInfo) {
            protected void fireAfterSendLogin(int code)
            {
                if(code == 0) {
                    log.debug("登录信息已经发出");
                }
                else
                {
                    log.error("登录信息发送失败");
                }
            }
        }.execute();
    }
}
