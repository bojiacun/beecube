package cn.winkt.modules.paimai.controller;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.AppSettingVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.config.PaimaiWebSocket;
import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.message.GoodsUpdateMessage;
import cn.winkt.modules.paimai.message.MessageConstant;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;

import org.jeecg.config.AppContext;
import org.parboiled.common.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
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

    @Resource
    AuctionGoodsService auctionGoodsService;

    @Resource
    AppApi appApi;

    @Resource
    MiniappServices miniappServices;
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
        pageList.getRecords().forEach(goods1 -> {
            if(goods1.getType() == 1) {
                goods1.setSales(goodsService.calcGoodsSales(goods1.getId()));
            }
        });
        return Result.OK(pageList);
    }

    @AutoLog(value = "拍品表-查询进行中的拍品")
    @ApiOperation(value = "拍品表-查询进行中的拍品", notes = "拍品表-查询进行中的拍品")
    @GetMapping(value = "/running")
    @AutoDict
    public Result<?> queryRunningPageList(Goods goods,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
                                   ) {
        Date nowDate = new Date();
        QueryWrapper<Goods> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("g.status", 1);
        queryWrapper.orderByDesc("g.end_time");
        queryWrapper.and(qw -> {
            qw.and(qw1 -> {
                qw1.eq("p.type", 2).eq("g.state", 1).or(qw2 -> {
                    qw2.eq("p.type", 1).lt("g.start_time", nowDate).and(qw3 -> {
                        qw3.gt("g.end_time", nowDate).or().gt("g.actual_end_time", nowDate);
                    });
                });
            });
        });
        if(StringUtils.isNotEmpty(goods.getTitle())) {
            queryWrapper.like("g.title", goods.getTitle());
        }

        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<GoodsVO> pageList = goodsService.selectPageVO(page, queryWrapper);
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
        Date endTime = goods.getActualEndTime() == null ? goods.getEndTime(): goods.getActualEndTime();
        if((endTime != null && endTime.before(new Date())) || old.getState() > 1) {
            throw new JeecgBootException("拍品已结束无法编辑");
        }
        if(old.getType() != 2) {
            if (old.getStartTime().equals(goods.getStartTime()) || old.getEndTime().equals(goods.getEndTime())) {
                GoodsUpdateMessage goodsUpdateMessage = new GoodsUpdateMessage();
                goodsUpdateMessage.setGoodsId(goods.getId());
                goodsUpdateMessage.setStartTime(goods.getStartTime());
                goodsUpdateMessage.setEndTime(goods.getEndTime());
                goodsUpdateMessage.setType(MessageConstant.MSG_TYPE_AUCTION_CHANGED);
            }
        }
        goodsService.updateById(goods);
        return Result.OK("编辑成功!");
    }

    @PostMapping("/offers")
    public Result<?> doOffer(@RequestBody JSONObject post) {
        return auctionGoodsService.offer(post);
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
                if (performance.getState() == 0) {
                    throw new JeecgBootException("拍品所在专场已经开始，并且尚未结束，无法删除");
                }
            }
        } else if(goods.getType() == 1){
            Date endTime = goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime();
            if(endTime != null && goods.getStartTime() != null) {
                if (nowDate.after(goods.getStartTime()) && nowDate.before(endTime)) {
                    throw new JeecgBootException("拍品正在拍卖中，无法删除");
                }
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
        Date endTime = goods.getActualEndTime() == null ? goods.getEndTime() : goods.getActualEndTime();
        if (StringUtils.isNotEmpty(goods.getPerformanceId())) {
            Performance performance = performanceService.getById(goods.getPerformanceId());
            if (performance.getType() == 1) {
                //未到时间不能成交
                if (new Date().before(endTime)) {
                    throw new JeecgBootException("拍品未结束不能成交");
                }
            } else if (performance.getType() == 2) {
                if (goods.getState() != 2) {
                    throw new JeecgBootException("拍品未结束不能成交");
                }
            }
        } else {
            if (new Date().before(endTime)) {
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
            goodsUpdateMessage.setDealUserId(goodsOffer.getMemberId());
            goodsUpdateMessage.setDealPrice(goodsOffer.getPrice());
            paimaiWebSocket.sendAllMessage(JSONObject.toJSONString(goodsUpdateMessage));
            goodsOfferService.updateById(goodsOffer);

            //计算成交佣金
            BigDecimal commission = BigDecimal.ZERO;
            if(goods.getCommission() != null) {
                commission = BigDecimal.valueOf(goods.getCommission()).divide(BigDecimal.valueOf(100), RoundingMode.CEILING);
            }

            BigDecimal price = BigDecimal.valueOf(goodsOffer.getPrice());
            BigDecimal newPrice = price.multiply(commission).add(price);

            //生成成交订单
            GoodsOrder goodsOrder = new GoodsOrder();
            goodsOrder.setMemberId(goodsOffer.getMemberId());
            goodsOrder.setMemberName(goodsOffer.getMemberName());
            goodsOrder.setMemberAvatar(goodsOffer.getMemberAvatar());
            goodsOrder.setStatus(0);
            goodsOrder.setPayedPrice(newPrice.floatValue());
            goodsOrder.setTotalPrice(newPrice.floatValue());
            goodsOrder.setGoodsCount(1);
            goodsOrder.setType(1);
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


            //发送模板消息


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

        //发送消息
        try{
            this.sendOfferResultMessage(goods);
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
        }

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


    @Async
    void sendOfferResultMessage(Goods goods) throws InvocationTargetException, IllegalAccessException, WxErrorException {
        LambdaQueryWrapper<GoodsOffer> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOffer::getGoodsId, goods.getId());

        List<GoodsOffer> goodsOffers = goodsOfferService.list(queryWrapper);
        WxMaService wxMaService = miniappServices.getWxMaService(AppContext.getApp());
        List<AppSettingVO> paimaiSettings = appApi.queryAppSettings(AppContext.getApp(), "paimai");
        String templateId = null;
        for (AppSettingVO s : paimaiSettings) {
            if (s.getSettingKey().equals("offerResultTemplateId")) {
                templateId = s.getSettingValue();
            }
        }

        if(templateId != null) {
            //发送缓存，已经发送的用户，跳过不再发送
            Set<String> sended = new HashSet<>();

            for (GoodsOffer goodsOffer : goodsOffers) {
                AppMemberVO appMemberVO = appApi.getMemberById(goodsOffer.getMemberId());
                if(sended.contains(appMemberVO.getId())) {
                    continue;
                }
                sended.add(appMemberVO.getId());
                WxMaSubscribeMessage m = new WxMaSubscribeMessage();
                m.setTemplateId(templateId);
                m.setMiniprogramState("formal");
                m.setPage("/pages/goods/detail?id="+goodsOffer.getGoodsId());
                m.setToUser(appMemberVO.getWxappOpenid());
                List<WxMaSubscribeMessage.MsgData> data = new ArrayList<>();

                WxMaSubscribeMessage.MsgData data1 = new WxMaSubscribeMessage.MsgData();
                data1.setName("character_string1.DATA");
                data1.setValue(goods.getId());
                data.add(data1);

                WxMaSubscribeMessage.MsgData data2 = new WxMaSubscribeMessage.MsgData();
                data2.setName("thing6.DATA");
                data2.setValue(goods.getTitle());
                data.add(data2);


                WxMaSubscribeMessage.MsgData data3 = new WxMaSubscribeMessage.MsgData();
                data3.setName("amount4.DATA");
                data3.setValue(BigDecimal.valueOf(goodsOffer.getPrice()).toString());
                data.add(data3);


                WxMaSubscribeMessage.MsgData data4 = new WxMaSubscribeMessage.MsgData();
                data2.setName("phrase5.DATA");
                data2.setValue(goodsOffer.getStatus() == 1 ? "中标":"未中标");
                data.add(data4);
                m.setData(data);
                wxMaService.getMsgService().sendSubscribeMsg(m);

            }
        }
    }
}
