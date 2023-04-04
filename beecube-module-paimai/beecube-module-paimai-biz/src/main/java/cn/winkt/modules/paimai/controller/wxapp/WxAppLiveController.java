package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
import cn.winkt.modules.paimai.service.ZeGoService;
import cn.winkt.modules.paimai.vo.ZegoSetting;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.beanutils.BeanUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/paimai/api/live")
public class WxAppLiveController {

    @Resource
    IGoodsCommonDescService goodsCommonDescService;

    @Resource
    ZeGoService zeGoService;

    @GetMapping("/test")
    public Result<?> test() {
        return Result.OK(zeGoService.describeUserNum());
    }

    @PutMapping("/login")
    public Result<?> login(@RequestBody LoginUser loginUser) throws InvocationTargetException, IllegalAccessException {
        LambdaQueryWrapper<GoodsCommonDesc> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.notLike(GoodsCommonDesc::getDescKey, "desc");
        List<GoodsCommonDesc> goodsCommonDescs = goodsCommonDescService.list(queryWrapper);
        Map<String, String> settingsMap = goodsCommonDescs.stream().collect(Collectors.toMap(GoodsCommonDesc::getDescKey, GoodsCommonDesc::getDescValue));
        ZegoSetting zegoSetting = new ZegoSetting();
        BeanUtils.copyProperties(zegoSetting, settingsMap);
        String token = zeGoService.getZeGouToken(zegoSetting.getZegoAppId(), zegoSetting.getZegoAppSign(), loginUser.getId());
        return Result.OK("登录成功",token);
    }
}
