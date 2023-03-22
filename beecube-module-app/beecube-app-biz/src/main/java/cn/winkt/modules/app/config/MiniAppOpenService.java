package cn.winkt.modules.app.config;


import cn.binarywang.wx.miniapp.api.WxMaService;
import me.chanjar.weixin.open.api.WxOpenMaService;
import org.springframework.stereotype.Component;

@Component
public class MiniAppOpenService {


    public WxOpenMaService wxOpenMaService(WxMaService wxMaService) {
        return null;
    }
}
