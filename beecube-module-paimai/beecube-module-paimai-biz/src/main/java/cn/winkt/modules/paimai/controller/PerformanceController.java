package cn.winkt.modules.paimai.controller;

import java.util.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.lang.Snowflake;
import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.message.GoodsUpdateMessage;
import cn.winkt.modules.paimai.message.MessageConstant;
import cn.winkt.modules.paimai.message.PerformanceUpdateMessage;
import cn.winkt.modules.paimai.service.IGoodsService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.IPerformanceService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description: 拍卖专场表
 * @Author: jeecg-boot
 * @Date: 2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "拍卖专场表")
@RestController
@RequestMapping("/paimai/performances")
public class PerformanceController extends JeecgController<Performance, IPerformanceService> {
    @Autowired
    private IPerformanceService performanceService;

    @Resource
    private IGoodsService goodsService;

    @Resource
    PaimaiWebSocket paimaiWebSocket;

    /**
     * 分页列表查询
     *
     * @param performance
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "拍卖专场表-分页列表查询")
    @ApiOperation(value = "拍卖专场表-分页列表查询", notes = "拍卖专场表-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(Performance performance,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<Performance> queryWrapper = QueryGenerator.initQueryWrapper(performance, req.getParameterMap());
        Page<Performance> page = new Page<Performance>(pageNo, pageSize);
        IPage<Performance> pageList = performanceService.page(page, queryWrapper);
        pageList.getRecords().forEach(r -> {
            LambdaQueryWrapper<Goods> goodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
            goodsLambdaQueryWrapper.eq(Goods::getPerformanceId, r.getId());
            int count = (int) goodsService.count(goodsLambdaQueryWrapper);
            r.setGoodsCount(count);
        });
        return Result.OK(pageList);
    }

    @AutoLog(value = "拍卖专场表-选择专场")
    @ApiOperation(value = "拍卖专场表-选择专场", notes = "拍卖专场表-选择专场")
    @GetMapping(value = "/select")
    @AutoDict
    public Result<?> selectPageList(Performance performance,
                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                    HttpServletRequest req) {
        QueryWrapper<Performance> queryWrapper = QueryGenerator.initQueryWrapper(performance, req.getParameterMap());
        queryWrapper.isNull("auction_id");
        Page<Performance> page = new Page<Performance>(pageNo, pageSize);
        IPage<Performance> pageList = performanceService.page(page, queryWrapper);
        return Result.OK(pageList);
    }
    @AutoLog(value = "拍卖专场表-已选专场")
    @ApiOperation(value = "拍卖专场表-已选专场", notes = "拍卖专场表-已选专场")
    @GetMapping(value = "/selected")
    @AutoDict
    public Result<?> selectedPageList(Performance performance,
                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                    HttpServletRequest req) {
        QueryWrapper<Performance> queryWrapper = QueryGenerator.initQueryWrapper(performance, req.getParameterMap());
        String auctionId = req.getParameter("ac_id");
        queryWrapper.eq("auction_id", auctionId);
        Page<Performance> page = new Page<Performance>(pageNo, pageSize);
        IPage<Performance> pageList = performanceService.page(page, queryWrapper);
        return Result.OK(pageList);
    }
    /**
     * 添加
     *
     * @param performance
     * @return
     */
    @AutoLog(value = "拍卖专场表-添加")
    @ApiOperation(value = "拍卖专场表-添加", notes = "拍卖专场表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody Performance performance) {
        performanceService.save(performance);
        return Result.OK("添加成功！");
    }

    /***
     * 手动控制专场开始
     * @param id
     * @return
     */
    @PutMapping("/start")
    public Result<?> manualStart(@RequestParam String id) {
        Performance performance = performanceService.getById(id);
        performance.setState(1);
        performance.setStartTime(new Date());
        performanceService.updateById(performance);
        PerformanceUpdateMessage message = new PerformanceUpdateMessage();
        message.setType(MessageConstant.MSG_TYPE_PEFORMANCE_STARTED);
        message.setState(1);
        message.setStartTime(performance.getStartTime());
        message.setPerformanceId(id);
        paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(message));
        return Result.OK(performance);
    }

    /**
     * 手动控制专场结束
     * @param id
     * @return
     */
    @PutMapping("/end")
    public Result<?> manualEnd(@RequestParam String id) {
        Performance performance = performanceService.getById(id);
        LambdaQueryWrapper<Goods> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Goods::getPerformanceId, performance.getId());
        List<Goods> goodsList = goodsService.list(queryWrapper);
        goodsList.forEach(goods -> {
            if(goods.getState() == 1) {
                throw new JeecgBootException("专场下有拍品正在运行，无法停止专场");
            }
        });
        performance.setEndTime(new Date());
        performance.setState(2);
        performanceService.updateById(performance);
        PerformanceUpdateMessage message = new PerformanceUpdateMessage();
        message.setType(MessageConstant.MSG_TYPE_PEFORMANCE_ENDED);
        message.setState(2);
        message.setEndTime(performance.getEndTime());
        message.setPerformanceId(id);
        paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(message));
        return Result.OK(performance);
    }

    /**
     * 手动设置拍品开始,设置拍品开始时间为当前时间
     * @return
     */
    @PutMapping("/goods/start")
    public Result<?> startGoods(@RequestParam String id) {
        Goods goods = goodsService.getById(id);
        Performance performance = performanceService.getById(goods.getPerformanceId());
        if(performance.getState() != 1) {
            throw new JeecgBootException("拍品所在专场没有开始，拍品无法开始！");
        }
        goods.setStartTime(new Date());
        goods.setState(1);
        goodsService.updateById(goods);
        GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
        goodsUpdateMessage.setGoodsId(id);
        goodsUpdateMessage.setState(1);
        goodsUpdateMessage.setStartTime(goods.getStartTime());
        goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_STARTED);
        paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
        return Result.OK(goods);
    }

    /**
     * 手动设置拍品结束时间
     * @return
     */
    @PutMapping("/goods/end")
    public Result<?> endGoods(@RequestParam String id) {
        Goods goods = goodsService.getById(id);
        goods.setEndTime(new Date());
        goods.setActualEndTime(goods.getEndTime());
        goods.setState(2);
        goodsService.updateById(goods);
        GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
        goodsUpdateMessage.setGoodsId(id);
        goodsUpdateMessage.setState(2);
        goodsUpdateMessage.setEndTime(goods.getEndTime());
        goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_ENDED);
        paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
        return Result.OK(goods);
    }
    @AutoLog(value = "拍卖专场表-添加")
    @ApiOperation(value = "拍卖专场表-添加", notes = "拍卖专场表-添加")
    @PostMapping(value = "/goods/add")
    public Result<?> addGoods(@RequestBody JSONObject jsonObject) {
        String perfId = jsonObject.getString("perfId");
        Performance performance = performanceService.getById(perfId);
        String goodsIds = jsonObject.getString("goodsIds");
        if(StringUtils.isEmpty(goodsIds)) {
            throw new JeecgBootException("请选择拍品");
        }
        LambdaQueryWrapper<Goods> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Goods::getId, Arrays.stream(goodsIds.split(",")).collect(Collectors.toList()));
		List<Goods> goodsList = goodsService.list(queryWrapper);

        //如果是限时拍专场则设置拍品结束时间为专场结束时间,如果是同步拍专场则去除拍品的结束时间及开始时间
        if(performance.getType() == 1) {
            for (Goods g : goodsList) {
                g.setPerformanceId(perfId);
                g.setPerformanceTitle(performance.getTitle());
                g.setType(3);
                g.setStartTime(performance.getStartTime());
                g.setEndTime(performance.getEndTime());
                g.setActualEndTime(null);

                GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
                goodsUpdateMessage.setGoodsId(g.getId());
                goodsUpdateMessage.setStartTime(performance.getStartTime());
                goodsUpdateMessage.setEndTime(performance.getEndTime());
                goodsUpdateMessage.setActualEndTime(null);
                goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_CHANGED);
                paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
            }
        }
        else if(performance.getType() == 2){
            for (Goods g : goodsList) {
                g.setPerformanceId(perfId);
                g.setPerformanceTitle(performance.getTitle());
                g.setState(0);
                g.setStartTime(null);
                g.setActualEndTime(null);
                g.setEndTime(null);
                GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
                goodsUpdateMessage.setGoodsId(g.getId());
                goodsUpdateMessage.setStartTime(null);
                goodsUpdateMessage.setEndTime(null);
                goodsUpdateMessage.setActualEndTime(null);
                goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_CHANGED);
                paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
            }
        }
		goodsService.updateBatchById(goodsList);
        return Result.OK("添加成功！");
    }
    @AutoLog(value = "拍卖专场表-移除拍品")
    @ApiOperation(value = "拍卖专场表-移除拍品", notes = "拍卖专场表-移除拍品")
    @DeleteMapping(value = "/goods/remove")
    public Result<?> removeGoods(@RequestBody JSONObject jsonObject) {
        String perfId = jsonObject.getString("perfId");
        String goodsIds = jsonObject.getString("goodsIds");
        if(StringUtils.isEmpty(goodsIds)) {
            throw new JeecgBootException("请选择拍品");
        }
        LambdaUpdateWrapper<Goods> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.in(Goods::getId, Arrays.stream(goodsIds.split(",")).collect(Collectors.toList()));
        updateWrapper.eq(Goods::getPerformanceId, perfId);
        updateWrapper.set(Goods::getPerformanceTitle, null);
        updateWrapper.set(Goods::getPerformanceId, null);
        goodsService.update(updateWrapper);
        return Result.OK("添加成功！");
    }
    /**
     * 编辑
     *
     * @param performance
     * @return
     */
    @AutoLog(value = "拍卖专场表-编辑")
    @ApiOperation(value = "拍卖专场表-编辑", notes = "拍卖专场表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    @Transactional
    public Result<?> edit(@RequestBody Performance performance) {
        Performance old = performanceService.getById(performance.getId());
        if(!old.getStartTime().equals(performance.getStartTime())||!old.getEndTime().equals(performance.getEndTime())) {
            PerformanceUpdateMessage message = new PerformanceUpdateMessage();
            message.setType(MessageConstant.MSG_TYPE_PEFORMANCE_CHANGED);
            message.setStartTime(performance.getStartTime());
            message.setEndTime(performance.getEndTime());
            message.setPerformanceId(performance.getId());
            paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(message));
            //批量更新专场下的所有拍品开始及结束时间
            LambdaUpdateWrapper<Goods> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.set(Goods::getStartTime, performance.getStartTime());
            updateWrapper.set(Goods::getEndTime, performance.getEndTime());
            updateWrapper.eq(Goods::getPerformanceId, performance.getId());
            goodsService.update(updateWrapper);
        }
        performanceService.updateById(performance);
        return Result.OK("编辑成功!");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "拍卖专场表-通过id删除")
    @ApiOperation(value = "拍卖专场表-通过id删除", notes = "拍卖专场表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        performanceService.removeById(id);
        LambdaUpdateWrapper<Goods> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(Goods::getPerformanceId, id);
        updateWrapper.set(Goods::getPerformanceId, null);
        goodsService.update(updateWrapper);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "拍卖专场表-批量删除")
    @ApiOperation(value = "拍卖专场表-批量删除", notes = "拍卖专场表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.performanceService.removeByIds(Arrays.asList(ids.split(",")));
        LambdaUpdateWrapper<Goods> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(Goods::getPerformanceId, Arrays.asList(ids.split(",")));
        updateWrapper.set(Goods::getPerformanceId, null);
        goodsService.update(updateWrapper);
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "拍卖专场表-通过id查询")
    @ApiOperation(value = "拍卖专场表-通过id查询", notes = "拍卖专场表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        Performance performance = performanceService.getById(id);
        return Result.OK(performance);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param performance
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, Performance performance) {
        return super.exportXls(request, performance, Performance.class, "拍卖专场表");
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
        return super.importExcel(request, response, Performance.class);
    }

}
