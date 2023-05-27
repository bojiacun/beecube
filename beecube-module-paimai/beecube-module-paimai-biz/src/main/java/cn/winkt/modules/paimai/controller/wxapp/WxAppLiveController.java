package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.service.im.ImClientService;
import cn.winkt.modules.paimai.vo.GoodsVO;
import cn.winkt.modules.paimai.vo.PerformanceVO;
import cn.winkt.modules.paimai.vo.ZegoSetting;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/live")
@Slf4j
public class WxAppLiveController {

    @Resource
    ILiveRoomService liveRoomService;

    @Resource
    ILiveRoomStreamService liveRoomStreamService;

    @Resource
    IGoodsService goodsService;

    @Resource
    ImClientService imClientService;

    @GetMapping("/rooms/{id}")
    public Result<LiveRoom> liveRoom(@PathVariable String id) {
        LiveRoom room = liveRoomService.getById(id);
        liveRoomService.updateRoomViews(id);
        LambdaQueryWrapper<LiveRoomStream> streamLambdaQueryWrapper = new LambdaQueryWrapper<>();
        streamLambdaQueryWrapper.eq(LiveRoomStream::getLiveId, room.getId());
        streamLambdaQueryWrapper.eq(LiveRoomStream::getStatus, 1);
        room.setStreams(liveRoomStreamService.list(streamLambdaQueryWrapper));
        return Result.OK("获取成功", room);
    }
    @GetMapping("/room/goods")
    public Result<List<GoodsVO>> roomGoodsList(@RequestParam String roomId) {
        QueryWrapper<Goods> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("g.room_id", roomId);
        queryWrapper.eq("g.status", 1);
        queryWrapper.orderByAsc("g.sort_num");
        return Result.OK(goodsService.selectListVO(queryWrapper));
    }
    @PutMapping("/room/logout")
    public Result<Boolean> logoutRoom(@RequestBody LiveRoom liveRoom) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        imClientService.logoutRoom(liveRoom.getId(), loginUser.getId());
        return Result.OK(true);
    }

    @GetMapping("/rooms")
    public Result<?> roomList(LiveRoom liveRoom,
                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                    HttpServletRequest req) {
        LambdaQueryWrapper<LiveRoom> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(LiveRoom::getStatus, 1);
        String source = req.getParameter("source");
        Date nowDate = new Date();
        if ("1".equals(source)) {
            //进行中
            queryWrapper.gt(LiveRoom::getEndTime, nowDate);
            queryWrapper.ne(LiveRoom::getState, 2);
        } else if ("2".equals(source)) {
            queryWrapper.and(qw -> {
                qw.lt(LiveRoom::getEndTime, nowDate).or().eq(LiveRoom::getState, 2);
            });
        }
        String key = req.getParameter("key");
        if(StringUtils.isNotEmpty(key)) {
            queryWrapper.like(LiveRoom::getTitle, key);
        }

        String tag = req.getParameter("tag");
        if (StringUtils.isNotEmpty(tag)) {
            queryWrapper.like(LiveRoom::getTags, tag);
        }
        //排序
        String orderBy = StringUtils.getIfEmpty(req.getParameter("orderBy"), () -> "desc");
        if (orderBy.equals("desc")) {
            queryWrapper.orderByDesc(LiveRoom::getStartTime);
        } else {
            queryWrapper.orderByAsc(LiveRoom::getStartTime);
        }

        Page<LiveRoom> page = new Page<>(pageNo, pageSize);
        IPage<LiveRoom> pageList = liveRoomService.page(page, queryWrapper);
        return Result.OK(pageList);
    }
}
