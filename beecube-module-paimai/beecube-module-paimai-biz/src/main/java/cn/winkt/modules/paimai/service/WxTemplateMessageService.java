package cn.winkt.modules.paimai.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.entity.GoodsOffer;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.jeecg.config.AppContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.math.RoundingMode;
import java.util.*;

@Service
@Slf4j
public class WxTemplateMessageService {

    @Resource
    private AppApi appApi;

    @Resource
    private MiniappServices miniappServices;

    @Async
    void sendTemplateMessage(String templateId, String params, String page, String memberId, String appId) throws InvocationTargetException, IllegalAccessException, WxErrorException {
        AppContext.setApp(appId);
        log.debug("发送模板消息 {}", appId);
        WxMaService wxMaService = miniappServices.getWxMaService(AppContext.getApp());
        AppMemberVO appMemberVO = appApi.getMemberById(memberId);
        WxMaSubscribeMessage m = new WxMaSubscribeMessage();
        m.setTemplateId(templateId);
        m.setMiniprogramState("formal");
        m.setPage(page);
        m.setToUser(appMemberVO.getWxappOpenid());
        List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();
        List<String> kvs = Arrays.asList(params.split(";"));
        kvs.forEach(kv -> {
            String[] _params = kv.split(":");
            WxMaSubscribeMessage.MsgData msgData = new WxMaSubscribeMessage.MsgData();
            msgData.setName(_params[0]);
            msgData.setValue(_params[1]);
            data.add(msgData);
        });
        m.setData(data);
        wxMaService.getMsgService().sendSubscribeMsg(m);
    }
}
