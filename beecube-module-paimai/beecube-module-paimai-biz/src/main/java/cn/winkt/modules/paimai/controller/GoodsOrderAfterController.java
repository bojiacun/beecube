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

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.OrderGoods;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IOrderGoodsService;
import cn.winkt.modules.paimai.vo.GoodsOrderAfterVO;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.GoodsOrderAfter;
import cn.winkt.modules.paimai.service.IGoodsOrderAfterService;

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
@RequestMapping("/paimai/orders/afters")
public class GoodsOrderAfterController extends JeecgController<GoodsOrderAfter, IGoodsOrderAfterService> {
    @Autowired
    private IGoodsOrderAfterService goodsOrderAfterService;

    @Resource
    private IGoodsService goodsService;

    @Resource
    private IOrderGoodsService orderGoodsService;

    /**
     * 分页列表查询
     *
     * @param goodsOrderAfter
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "订单售后表-分页列表查询")
    @ApiOperation(value = "订单售后表-分页列表查询", notes = "订单售后表-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(GoodsOrderAfter goodsOrderAfter,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<GoodsOrderAfter> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrderAfter, req.getParameterMap());
        Page<GoodsOrderAfter> page = new Page<GoodsOrderAfter>(pageNo, pageSize);
        IPage<GoodsOrderAfterVO> pageList = goodsOrderAfterService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param goodsOrderAfter
     * @return
     */
    @AutoLog(value = "订单售后表-添加")
    @ApiOperation(value = "订单售后表-添加", notes = "订单售后表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody GoodsOrderAfter goodsOrderAfter) {
        goodsOrderAfterService.save(goodsOrderAfter);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param goodsOrderAfter
     * @return
     */
    @AutoLog(value = "订单售后表-编辑")
    @ApiOperation(value = "订单售后表-编辑", notes = "订单售后表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody GoodsOrderAfter goodsOrderAfter) {
        goodsOrderAfterService.updateById(goodsOrderAfter);
        return Result.OK("编辑成功!");
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
        goodsOrderAfterService.removeById(id);
        return Result.OK("删除成功!");
    }

    @AutoLog(value = "订单售后表-确认通过")
    @ApiOperation(value = "订单售后表-确认通过", notes = "订单售后表-确认通过")
    @DeleteMapping(value = "/after_pass")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> passRequest(@RequestParam(name = "id", required = true) String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        GoodsOrderAfter goodsOrderAfter = goodsOrderAfterService.getById(id);
        goodsOrderAfter.setStatus(1);
        goodsOrderAfter.setResolver(loginUser.getUsername());
        //申请通过，如果是退货，那么就要找到该拍品并且库存加一
        OrderGoods orderGoods = orderGoodsService.getById(goodsOrderAfter.getOrderGoodsId());
        Goods goods = goodsService.getById(orderGoods.getGoodsId());
        goods.setStock((goods.getStock() == null ? 0 : goods.getStock())+1);
        goodsOrderAfterService.updateById(goodsOrderAfter);
        goodsService.updateById(goods);
        return Result.OK("删除成功!");
    }

    @AutoLog(value = "订单售后表-确认拒绝")
    @ApiOperation(value = "订单售后表-确认拒绝", notes = "订单售后表-确认拒绝")
    @DeleteMapping(value = "/after_deny")
    @Transactional(rollbackFor = Exception.class)
    public Result<?> denyRequest(@RequestParam(name = "id", required = true) String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        GoodsOrderAfter goodsOrderAfter = goodsOrderAfterService.getById(id);
        goodsOrderAfter.setStatus(2);
        goodsOrderAfter.setResolver(loginUser.getUsername());
        goodsOrderAfterService.updateById(goodsOrderAfter);
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
        this.goodsOrderAfterService.removeByIds(Arrays.asList(ids.split(",")));
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
        GoodsOrderAfter goodsOrderAfter = goodsOrderAfterService.getById(id);
        return Result.OK(goodsOrderAfter);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param goodsOrderAfter
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, GoodsOrderAfter goodsOrderAfter) {
        return super.exportXls(request, goodsOrderAfter, GoodsOrderAfter.class, "订单售后表");
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
        return super.importExcel(request, response, GoodsOrderAfter.class);
    }

}
