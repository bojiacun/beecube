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

import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.message.GoodsUpdateMessage;
import cn.winkt.modules.paimai.message.MessageConstant;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;

import java.util.Date;

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

import org.parboiled.common.StringUtils;
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
 * @Description: 拍品表
 * @Author: jeecg-boot
 * @Date: 2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "拍品表")
@RestController
@RequestMapping("/paimai/goods")
public class GoodsController extends JeecgController<Goods, IGoodsService> {
    @Autowired
    private IGoodsService goodsService;

    @Resource
    private IPerformanceService performanceService;

    @Resource
    private IGoodsOfferService goodsOfferService;

    @Resource
    PaimaiWebSocket paimaiWebSocket;

    @Resource
    private IGoodsOrderService goodsOrderService;

    @Resource
    private IOrderGoodsService orderGoodsService;

    /**
     * 分页列表查询
     *
     * @param goods
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "拍品表-分页列表查询")
    @ApiOperation(value = "拍品表-分页列表查询", notes = "拍品表-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(Goods goods,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<Goods> queryWrapper = QueryGenerator.initQueryWrapper(goods, req.getParameterMap());
        queryWrapper.isNull("performance_id");
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    @AutoLog(value = "拍品表-选择拍品")
    @ApiOperation(value = "拍品表-选择拍品", notes = "拍品表-选择拍品")
    @GetMapping(value = "/select")
    @AutoDict
    public Result<?> selectPageList(Goods goods,
                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                    HttpServletRequest req) {
        QueryWrapper<Goods> queryWrapper = QueryGenerator.initQueryWrapper(goods, req.getParameterMap());
        queryWrapper.isNull("performance_id");
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    @AutoLog(value = "拍品表-已选拍品")
    @ApiOperation(value = "拍品表-已选拍品", notes = "拍品表-已选拍品")
    @GetMapping(value = "/selected")
    @AutoDict
    public Result<?> selectedPageList(Goods goods,
                                      @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                      @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                      HttpServletRequest req) {
        QueryWrapper<Goods> queryWrapper = QueryGenerator.initQueryWrapper(goods, req.getParameterMap());
        String perfId = req.getParameter("perf_id");
        queryWrapper.eq("performance_id", perfId);
        queryWrapper.orderByAsc("sort_num");
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param goods
     * @return
     */
    @AutoLog(value = "拍品表-添加")
    @ApiOperation(value = "拍品表-添加", notes = "拍品表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody Goods goods) {
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            Performance performance = performanceService.getById(goods.getPerformanceId());
            if (performance.getType() == 1) {
                //限时拍，同步限时拍时间
                goods.setStartTime(performance.getStartTime());
                goods.setEndTime(performance.getEndTime());
            } else if (performance.getType() == 2) {
                goods.setState(0);
                goods.setStartTime(performance.getStartTime());
                goods.setEndTime(null);
                goods.setActualEndTime(null);
            }
        }
        goodsService.save(goods);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param goods
     * @return
     */
    @AutoLog(value = "拍品表-编辑")
    @ApiOperation(value = "拍品表-编辑", notes = "拍品表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody Goods goods) {
        Goods old = goodsService.getById(goods.getId());
        if (old.getStartTime().equals(goods.getStartTime()) || old.getEndTime().equals(goods.getEndTime())) {
            GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
            goodsUpdateMessage.setGoodsId(goods.getId());
            goodsUpdateMessage.setStartTime(goods.getStartTime());
            goodsUpdateMessage.setEndTime(goods.getEndTime());
            goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_CHANGED);
        }
        goodsService.updateById(goods);
        return Result.OK("编辑成功!");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "拍品表-通过id删除")
    @ApiOperation(value = "拍品表-通过id删除", notes = "拍品表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        Goods goods = goodsService.getById(id);
        Date nowDate = new Date();
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            Performance performance = performanceService.getById(goods.getPerformanceId());
            if (performance.getType() == 1) {
                if (nowDate.after(performance.getStartTime()) && nowDate.before(performance.getEndTime())) {
                    throw new JeecgBootException("拍品所在专场已经开始，并且尚未结束，无法删除");
                }
            } else if (performance.getType() == 2) {
                if (performance.getState() == 1) {
                    throw new JeecgBootException("拍品所在专场已经开始，并且尚未结束，无法删除");
                }
            }
        } else {
            Date endTime = goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime();
            if (nowDate.after(goods.getStartTime()) && nowDate.before(endTime)) {
                throw new JeecgBootException("拍品正在拍卖中，无法删除");
            }
        }
        goodsService.removeById(id);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "拍品表-批量删除")
    @ApiOperation(value = "拍品表-批量删除", notes = "拍品表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.goodsService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "拍品表-通过id查询")
    @ApiOperation(value = "拍品表-通过id查询", notes = "拍品表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        Goods goods = goodsService.getById(id);
        return Result.OK(goods);
    }

    @AutoLog(value = "出价记录表-确认成交")
    @ApiOperation(value = "出价记录表-确认成交", notes = "出价记录表-确认成交")
    @RequestMapping(value = "/deal", method = {RequestMethod.PUT, RequestMethod.POST})
    @Transactional
    public Result<?> confirmDeal(@RequestParam String id, @RequestParam Integer status) {
        Goods goods = goodsService.getById(id);
        if(goods.getState() > 2) {
            throw new JeecgBootException("请不要重复确认成交或流拍");
        }
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            Performance performance = performanceService.getById(goods.getPerformanceId());
            if (performance.getType() == 1) {
                //未到时间不能成交
                if (new Date().after(goods.getEndTime())) {
                    throw new JeecgBootException("拍品未结束不能成交");
                }
            } else if (performance.getType() == 2) {
                if (goods.getState() != 2) {
                    throw new JeecgBootException("拍品未结束不能成交");
                }
            }
        } else {
            if (new Date().after(goods.getEndTime())) {
                throw new JeecgBootException("拍品未结束不能成交");
            }
        }

        GoodsOffer goodsOffer = goodsOfferService.getMaxOfferRow(id);
        GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
        goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_CHANGED);
        goodsUpdateMessage.setEndTime(goods.getEndTime());
        goodsUpdateMessage.setActualEndTime(goods.getActualEndTime());
        goodsUpdateMessage.setGoodsId(goods.getId());
        goodsUpdateMessage.setStartTime(goods.getStartTime());

        if (status == 3) {
            if(goodsOffer == null) {
                throw new JeecgBootException("没有人出价，无法确认成交");
            }
            goods.setDealPrice(goodsOffer.getPrice());
            goodsOffer.setStatus(1);
            goods.setState(3);
            goodsUpdateMessage.setState(3);
            goodsUpdateMessage.setDealPrice(goodsOffer.getPrice());
            paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
            goodsOfferService.updateById(goodsOffer);

            //生成成交订单
            GoodsOrder goodsOrder = new GoodsOrder();
            goodsOrder.setMemberId(goodsOffer.getMemberId());
            goodsOrder.setMemberName(goodsOffer.getMemberName());
            goodsOrder.setMemberAvatar(goodsOffer.getMemberAvatar());
            goodsOrder.setStatus(0);
            goodsOrder.setPayedPrice(goodsOffer.getPrice());
            goodsOrder.setTotalPrice(goodsOffer.getPrice());
            goodsOrder.setGoodsCount(1);
            goodsOrder.setType(2);
            goodsOrder.setGoodsOfferId(goodsOffer.getId());
            goodsOrder.setPerformanceId(goodsOffer.getPerformanceId());
            goodsOrderService.save(goodsOrder);

            OrderGoods orderGoods = new OrderGoods();
            orderGoods.setGoodsImage(goods.getImages().split(",")[0]);
            orderGoods.setGoodsName(goods.getTitle());
            orderGoods.setGoodsId(goods.getId());
            orderGoods.setGoodsPrice(goodsOffer.getPrice());
            orderGoods.setGoodsCount(1);
            orderGoods.setOrderId(goodsOrder.getId());
            orderGoodsService.save(orderGoods);

        } else if (status == 4) {
            LambdaUpdateWrapper<GoodsOffer> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(GoodsOffer::getGoodsId, goods.getId());
            updateWrapper.set(GoodsOffer::getStatus, 2);
            goodsOfferService.update(updateWrapper);
            goods.setState(4);
            goodsUpdateMessage.setState(4);
            paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
        }

        goodsService.updateById(goods);

        return Result.OK("确认成功!");
    }

    /**
     * 导出excel
     *
     * @param request
     * @param goods
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, Goods goods) {
        return super.exportXls(request, goods, Goods.class, "拍品表");
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
        return super.importExcel(request, response, Goods.class);
    }

}
