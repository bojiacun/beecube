package cn.winkt.modules.app.config;


import cn.binarywang.wx.miniapp.api.WxMaService;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import me.chanjar.weixin.open.api.WxOpenMaService;
import org.springframework.stereotype.Component;

@Component
public class MiniAppOpenService {


    public WxOpenMaService wxOpenMaService() {
        return null;
    }

    public WxOpenComponentService getWxOpenComponentService() {
        return null;
    }
}
