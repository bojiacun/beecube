package cn.winkt.modules.paimai.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.OrderVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.GoodsOrder;

import java.util.Date;
import java.util.stream.Collectors;

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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date: 2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "订单表")
@RestController
@RequestMapping("/orders")
public class GoodsOrderController extends JeecgController<GoodsOrder, IGoodsOrderService> {
    @Autowired
    private IGoodsOrderService goodsOrderService;

    @Resource
    private IOrderGoodsService orderGoodsService;

    @Resource
    AppApi appApi;

    @Resource
    IGoodsService goodsService;

    @Resource
    CommissionService commissionService;

    @Resource
    private IGoodsCommonDescService goodsCommonDescService;

    @Resource
    private WxTemplateMessageService wxTemplateMessageService;

    /**
     * 分页列表查询
     *
     * @param goodsOrder
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "订单表-分页列表查询")
    @ApiOperation(value = "订单表-分页列表查询", notes = "订单表-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(GoodsOrder goodsOrder,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<GoodsOrder> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrder, req.getParameterMap());
        Page<GoodsOrder> page = new Page<>(pageNo, pageSize);
        IPage<GoodsOrder> pageList = goodsOrderService.page(page, queryWrapper);
        pageList.getRecords().forEach(r -> {
            LambdaQueryWrapper<OrderGoods> qw = new LambdaQueryWrapper<>();
            qw.eq(OrderGoods::getOrderId, r.getId());
            r.setOrderGoods(orderGoodsService.list(qw));
        });
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param goodsOrder
     * @return
     */
    @AutoLog(value = "订单表-添加")
    @ApiOperation(value = "订单表-添加", notes = "订单表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody GoodsOrder goodsOrder) {
        goodsOrderService.save(goodsOrder);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param goodsOrder
     * @return
     */
    @AutoLog(value = "订单表-编辑")
    @ApiOperation(value = "订单表-编辑", notes = "订单表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody GoodsOrder goodsOrder) {
        goodsOrderService.updateById(goodsOrder);
        return Result.OK("编辑成功!");
    }

    @AutoLog(value = "订单表-确认支付")
    @ApiOperation(value = "订单表-确认支付", notes = "订单表-确认支付")
    @RequestMapping(value = "/pay/confirm", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> payConfirm(@RequestParam String id) {
        GoodsOrder goodsOrder = goodsOrderService.getById(id);
        if(goodsOrder.getStatus() != 0) {
            throw new JeecgBootException("订单状态异常，请确认订单是否已经支付");
        }
        goodsOrder.setStatus(1);
        goodsOrderService.updateById(goodsOrder);
        return Result.OK("编辑成功!");
    }
    @AutoLog(value = "订单表-确认收货")
    @ApiOperation(value = "订单表-确认收货", notes = "订单表-确认收货")
    @RequestMapping(value = "/delivery/confirm", method = {RequestMethod.PUT, RequestMethod.POST})
    @Transactional(rollbackFor = Exception.class)
    public Result<?> deliveryConfirm(@RequestParam String id) {
        GoodsOrder goodsOrder = goodsOrderService.getById(id);
        if(goodsOrder.getStatus() != 2) {
            throw new JeecgBootException("订单状态异常，请确认订单是否已经收货");
        }
        goodsOrder.setStatus(3);
        goodsOrderService.updateById(goodsOrder);
        commissionService.dispatchComission(goodsOrder);
        return Result.OK("编辑成功!");
    }
    @AutoLog(value = "订单表-确认发货")
    @ApiOperation(value = "订单表-确认发货", notes = "订单表-确认发货")
    @RequestMapping(value = "/delivery", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> delivery(@RequestBody GoodsOrder goodsOrder) {
        goodsOrder = goodsOrderService.getById(goodsOrder.getId());
        if(goodsOrder.getStatus() != 1) {
            throw new JeecgBootException("订单状态异常，请确认订单是否已经发货");
        }
        goodsOrder.setStatus(2);
        goodsOrderService.updateById(goodsOrder);


        //发送订单发货模板消息
        try {
            List<GoodsCommonDesc> paimaiSettings = goodsCommonDescService.list();
            String templateId = null;
            String templateParams = null;
            for (GoodsCommonDesc s : paimaiSettings) {
                if (s.getDescKey().equals("orderDeliveryTemplateId")) {
                    templateId = s.getDescValue();
                } else if (s.getDescKey().equals("orderDeliveryTemplateArgs")) {
                    templateParams = s.getDescValue();
                }
            }

            if (StringUtils.isNotEmpty(templateId) && StringUtils.isNotEmpty(templateParams)) {
                templateParams = templateParams.replace("{orderId}", goodsOrder.getId());
                templateParams = templateParams.replace("{createTime}", DateFormatUtils.format(goodsOrder.getCreateTime(), "yyyy-MM-dd HH:mm:ss"));
                templateParams = templateParams.replace("{goodsNames}", goodsOrder.getOrderGoods().stream().map(OrderGoods::getGoodsName).collect(Collectors.joining()));
                templateParams = templateParams.replace("{deliveryCode}", goodsOrder.getDeliveryNo());
                wxTemplateMessageService.sendTemplateMessage(templateId, templateParams, "/order/pages/detail?id=" + goodsOrder.getId(), goodsOrder.getMemberId(), AppContext.getApp());
            }
        }
        catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }

        return Result.OK("编辑成功!");
    }
    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "订单表-通过id删除")
    @ApiOperation(value = "订单表-通过id删除", notes = "订单表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        goodsOrderService.removeById(id);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "订单表-批量删除")
    @ApiOperation(value = "订单表-批量删除", notes = "订单表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.goodsOrderService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "订单表-通过id查询")
    @ApiOperation(value = "订单表-通过id查询", notes = "订单表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        GoodsOrder goodsOrder = goodsOrderService.getById(id);
        return Result.OK(goodsOrder);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param goodsOrder
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, GoodsOrder goodsOrder) {
        return super.exportXls(request, goodsOrder, GoodsOrder.class, "订单表");
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
        return super.importExcel(request, response, GoodsOrder.class);
    }

}
