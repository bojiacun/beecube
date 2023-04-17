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
import javax.websocket.server.ServerEndpoint;
import java.util.Observable;
import java.util.Observer;

@Service
@Slf4j
public class ImClientService {
    @Resource
    ServerEventListenerImpl serverEventListener;



    public void sendMessage(BaseMessage message, int typeu) {
        log.debug("IM客户端开始发送消息，消息体信息是：{}, 类型：{}", JSONObject.toJSONString(message), typeu);
        String appId = AppContext.getApp();
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        message.setAppId(appId);
        serverEventListener.notifyAppUsers(appId, JSONObject.toJSONString(message), null, typeu);
    }
}
