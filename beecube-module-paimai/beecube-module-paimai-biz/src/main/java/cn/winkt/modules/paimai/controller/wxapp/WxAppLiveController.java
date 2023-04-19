package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.entity.LiveRoom;
import cn.winkt.modules.paimai.entity.LiveRoomStream;
import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
import cn.winkt.modules.paimai.service.ILiveRoomService;
import cn.winkt.modules.paimai.service.ILiveRoomStreamService;
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
@RequestMapping("/api/live")
public class WxAppLiveController {

    @Resource
    IGoodsCommonDescService goodsCommonDescService;

    @Resource
    ZeGoService zeGoService;

    @Resource
    ILiveRoomService liveRoomService;

    @Resource
    ILiveRoomStreamService liveRoomStreamService;

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
    @GetMapping("/rooms/{id}")
    public Result<LiveRoom> liveRoom(@PathVariable  String id) {
        LiveRoom room = liveRoomService.getById(id);
        LambdaQueryWrapper<LiveRoomStream> streamLambdaQueryWrapper = new LambdaQueryWrapper<>();
        streamLambdaQueryWrapper.eq(LiveRoomStream::getLiveId, room.getId());
        room.setStreams(liveRoomStreamService.list(streamLambdaQueryWrapper));

        return Result.OK("获取成功", liveRoomService.getById(id));
    }
    @GetMapping("/rooms")
    public Result<LiveRoom> memberLiveRoom(@RequestParam String memberId) {
        LambdaQueryWrapper<LiveRoom> liveRoomLambdaQueryWrapper = new LambdaQueryWrapper<>();
        liveRoomLambdaQueryWrapper.eq(LiveRoom::getMainAnchor, memberId).or().eq(LiveRoom::getSubAnchor, memberId);
        List<LiveRoom> liveRooms = liveRoomService.list(liveRoomLambdaQueryWrapper);
        LiveRoom result = null;
        if(liveRooms.size() > 0) {
            result = liveRooms.get(0);
        }
        return Result.OK("获取成功", result);
    }
}
