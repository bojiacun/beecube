package cn.winkt.modules.paimai.controller.wxapp;


import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/paimai/api/settings")
public class WxAppSettingsController {

    @Resource
    IGoodsCommonDescService goodsCommonDescService;

    @GetMapping
    public Result<?> paimaiSettings() {
        return Result.OK(goodsCommonDescService.list());
    }
}
