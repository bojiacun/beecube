package cn.winkt.modules.paimai.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.paimai.service.im.ImClientService;
import cn.winkt.modules.paimai.service.im.UserMessageType;
import cn.winkt.modules.paimai.service.im.message.RoomStreamChangedMessage;
import cn.winkt.modules.paimai.vo.LiveRecordCallbackVo;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.LiveRoomStream;
import cn.winkt.modules.paimai.service.ILiveRoomStreamService;

import java.util.Date;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.config.AppContext;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description: 直播间视频流信息表
 * @Author: jeecg-boot
 * @Date: 2023-04-19
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "直播间视频流信息表")
@RestController
@RequestMapping("/streams")
public class LiveRoomStreamController extends JeecgController<LiveRoomStream, ILiveRoomStreamService> {
    @Autowired
    private ILiveRoomStreamService liveRoomStreamService;

    @Resource
    private ImClientService imClientService;
    /**
     * 分页列表查询
     *
     * @param liveRoomStream
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "直播间视频流信息表-分页列表查询")
    @ApiOperation(value = "直播间视频流信息表-分页列表查询", notes = "直播间视频流信息表-分页列表查询")
    @GetMapping(value = "/list")
    public Result<?> queryPageList(LiveRoomStream liveRoomStream,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<LiveRoomStream> queryWrapper = QueryGenerator.initQueryWrapper(liveRoomStream, req.getParameterMap());
        Page<LiveRoomStream> page = new Page<LiveRoomStream>(pageNo, pageSize);
        IPage<LiveRoomStream> pageList = liveRoomStreamService.page(page, queryWrapper);
        return Result.OK(pageList);
    }


    @RequestMapping(value = "/records", method = {RequestMethod.POST, RequestMethod.PUT})
    public Result<String> recordCallbackNotify(@RequestBody LiveRecordCallbackVo callbackVo) {
        log.info("腾讯直播录制回调内容为：{}", JSONObject.toJSONString(callbackVo));
        AppContext.setApp(callbackVo.getAppname());
        String streamId = callbackVo.getStream_id();
        LiveRoomStream stream = liveRoomStreamService.getById(streamId);
        if(stream == null) {
            return Result.OK("false");
        }
        stream.setPlaybackUrl(callbackVo.getVideo_url());
        stream.setCallbackData(JSONObject.toJSONString(callbackVo));
        liveRoomStreamService.updateById(stream);
        return Result.OK("success");
    }

    /**
     * 添加
     *
     * @param liveRoomStream
     * @return
     */
    @AutoLog(value = "直播间视频流信息表-添加")
    @ApiOperation(value = "直播间视频流信息表-添加", notes = "直播间视频流信息表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody LiveRoomStream liveRoomStream) {
        liveRoomStreamService.save(liveRoomStream);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param liveRoomStream
     * @return
     */
    @AutoLog(value = "直播间视频流信息表-编辑")
    @ApiOperation(value = "直播间视频流信息表-编辑", notes = "直播间视频流信息表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody LiveRoomStream liveRoomStream) {
        liveRoomStreamService.updateById(liveRoomStream);
        return Result.OK("编辑成功!");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "直播间视频流信息表-通过id删除")
    @ApiOperation(value = "直播间视频流信息表-通过id删除", notes = "直播间视频流信息表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        liveRoomStreamService.removeById(id);
        return Result.OK("删除成功!");
    }

    @DeleteMapping(value = "/repush")
    public Result<?> repush(@RequestParam(name = "id", required = true) String id) {
        LiveRoomStream stream = liveRoomStreamService.getById(id);
        stream.setStatus(1);
        liveRoomStreamService.updateById(stream);
        RoomStreamChangedMessage roomStreamChangedMessage = new RoomStreamChangedMessage();
        LambdaQueryWrapper<LiveRoomStream> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(LiveRoomStream::getStatus, 1);
        List<LiveRoomStream> streams = liveRoomStreamService.list(queryWrapper);
        roomStreamChangedMessage.setNewStreams(streams);
        roomStreamChangedMessage.setRoomId(stream.getLiveId());
        roomStreamChangedMessage.setAppId(AppContext.getApp());
        imClientService.sendRoomMessage(stream.getLiveId(), roomStreamChangedMessage, UserMessageType.ROOM_STREAM_CHANGED);
        return Result.OK("设置成功!");
    }
    @DeleteMapping(value = "/disable")
    public Result<?> disable(@RequestParam(name = "id", required = true) String id) {
        LiveRoomStream stream = liveRoomStreamService.getById(id);
        stream.setStatus(0);
        liveRoomStreamService.updateById(stream);
        RoomStreamChangedMessage roomStreamChangedMessage = new RoomStreamChangedMessage();
        LambdaQueryWrapper<LiveRoomStream> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(LiveRoomStream::getStatus, 1);
        List<LiveRoomStream> streams = liveRoomStreamService.list(queryWrapper);
        roomStreamChangedMessage.setNewStreams(streams);
        roomStreamChangedMessage.setRoomId(stream.getLiveId());
        roomStreamChangedMessage.setAppId(AppContext.getApp());
        imClientService.sendRoomMessage(stream.getLiveId(), roomStreamChangedMessage, UserMessageType.ROOM_STREAM_CHANGED);
        return Result.OK("设置成功!");
    }
    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "直播间视频流信息表-批量删除")
    @ApiOperation(value = "直播间视频流信息表-批量删除", notes = "直播间视频流信息表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.liveRoomStreamService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "直播间视频流信息表-通过id查询")
    @ApiOperation(value = "直播间视频流信息表-通过id查询", notes = "直播间视频流信息表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        LiveRoomStream liveRoomStream = liveRoomStreamService.getById(id);
        return Result.OK(liveRoomStream);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param liveRoomStream
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, LiveRoomStream liveRoomStream) {
        return super.exportXls(request, liveRoomStream, LiveRoomStream.class, "直播间视频流信息表");
    }

    /**
     * 通过excel导入数据
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, LiveRoomStream.class);
    }

}
