package cn.winkt.modules.paimai.controller;

import java.lang.reflect.InvocationTargetException;
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

import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.vo.GoodsDepositVO;
import com.github.binarywang.wxpay.bean.request.WxPayRefundRequest;
import com.github.binarywang.wxpay.bean.result.WxPayRefundResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.service.IGoodsDepositService;

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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date: 2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "订单售后表")
@RestController
@RequestMapping("/paimai/deposits")
public class GoodsDepositController extends JeecgController<GoodsDeposit, IGoodsDepositService> {
    @Autowired
    private IGoodsDepositService goodsDepositService;
    @Resource
    MiniappServices miniappServices;

    /**
     * 分页列表查询
     *
     * @param goodsDeposit
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "订单售后表-分页列表查询")
    @ApiOperation(value = "订单售后表-分页列表查询", notes = "订单售后表-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(GoodsDeposit goodsDeposit,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<GoodsDeposit> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotEmpty(goodsDeposit.getGoodsId())) {
            queryWrapper.eq("gd.goods_id", goodsDeposit.getGoodsId());
        }
        if(StringUtils.isNotEmpty(goodsDeposit.getPerformanceId())) {
            queryWrapper.eq("gd.performance_id", goodsDeposit.getPerformanceId());
        }
        queryWrapper.orderByDesc("gd.price");
        queryWrapper.gt("gd.status", 0);

        Page<GoodsDeposit> page = new Page<GoodsDeposit>(pageNo, pageSize);
        IPage<GoodsDepositVO> pageList = goodsDepositService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param goodsDeposit
     * @return
     */
    @AutoLog(value = "订单售后表-添加")
    @ApiOperation(value = "订单售后表-添加", notes = "订单售后表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody GoodsDeposit goodsDeposit) {
        goodsDepositService.save(goodsDeposit);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param goodsDeposit
     * @return
     */
    @AutoLog(value = "订单售后表-编辑")
    @ApiOperation(value = "订单售后表-编辑", notes = "订单售后表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody GoodsDeposit goodsDeposit) {
        goodsDepositService.updateById(goodsDeposit);
        return Result.OK("编辑成功!");
    }

    @AutoLog(value = "订单售后表-编辑")
    @ApiOperation(value = "订单售后表-编辑", notes = "订单售后表-编辑")
    @RequestMapping(value = "/refund", method = {RequestMethod.DELETE})
    @Transactional(rollbackFor = Exception.class)
    public Result<?> refund(@RequestParam String id) throws WxPayException, InvocationTargetException, IllegalAccessException {
        GoodsDeposit deposit = goodsDepositService.getById(id);
		deposit.setStatus(2);
        goodsDepositService.updateById(deposit);
        log.debug("退款金额为 {}", deposit.getPrice());
        Integer refundAmount = BigDecimal.valueOf(deposit.getPrice()).setScale(2, RoundingMode.CEILING).multiply(BigDecimal.valueOf(100)).intValue();
        log.debug("实际退款金额为 {}", refundAmount);
        WxPayRefundRequest refundRequest = WxPayRefundRequest.newBuilder()
                .transactionId(deposit.getTransactionId())
                .outRefundNo(deposit.getId())
                .totalFee(refundAmount)
                .refundFee(refundAmount)
                .build();
        WxPayService wxPayService = miniappServices.getService(AppContext.getApp());
        WxPayRefundResult result = wxPayService.refund(refundRequest);
        if (!"SUCCESS".equals(result.getReturnCode()) || !"SUCCESS".equals(result.getResultCode())) {
            throw new JeecgBootException("退款失败");
        }
        return Result.OK("退款成功!");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "订单售后表-通过id删除")
    @ApiOperation(value = "订单售后表-通过id删除", notes = "订单售后表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        goodsDepositService.removeById(id);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "订单售后表-批量删除")
    @ApiOperation(value = "订单售后表-批量删除", notes = "订单售后表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.goodsDepositService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "订单售后表-通过id查询")
    @ApiOperation(value = "订单售后表-通过id查询", notes = "订单售后表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        GoodsDeposit goodsDeposit = goodsDepositService.getById(id);
        return Result.OK(goodsDeposit);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param goodsDeposit
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, GoodsDeposit goodsDeposit) {
        return super.exportXls(request, goodsDeposit, GoodsDeposit.class, "订单售后表");
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
        return super.importExcel(request, response, GoodsDeposit.class);
    }

}
