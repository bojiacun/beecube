package cn.winkt.modules.paimai.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.BuyoutGoodsClass;
import cn.winkt.modules.paimai.service.IBuyoutGoodsClassService;

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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description: 一口价分类
 * @Author: jeecg-boot
 * @Date: 2023-03-07
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "一口价分类")
@RestController
@RequestMapping("/buyout/classes")
public class BuyoutGoodsClassController extends JeecgController<BuyoutGoodsClass, IBuyoutGoodsClassService> {
    @Autowired
    private IBuyoutGoodsClassService buyoutGoodsClassService;

    /**
     * 分页列表查询
     *
     * @param buyoutGoodsClass
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "一口价分类-分页列表查询")
    @ApiOperation(value = "一口价分类-分页列表查询", notes = "一口价分类-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(BuyoutGoodsClass buyoutGoodsClass,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<BuyoutGoodsClass> queryWrapper = QueryGenerator.initQueryWrapper(buyoutGoodsClass, req.getParameterMap());
        Page<BuyoutGoodsClass> page = new Page<BuyoutGoodsClass>(pageNo, pageSize);
        IPage<BuyoutGoodsClass> pageList = buyoutGoodsClassService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    @AutoLog(value = "一口价分类-列表查询")
    @ApiOperation(value = "一口价分类-列表查询", notes = "一口价分类-列表查询")
    @GetMapping(value = "/all")
    public Result<?> allList() {
        return Result.OK(buyoutGoodsClassService.list());
    }

    /**
     * 添加
     *
     * @param buyoutGoodsClass
     * @return
     */
    @AutoLog(value = "一口价分类-添加")
    @ApiOperation(value = "一口价分类-添加", notes = "一口价分类-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody BuyoutGoodsClass buyoutGoodsClass) {
        buyoutGoodsClassService.save(buyoutGoodsClass);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param buyoutGoodsClass
     * @return
     */
    @AutoLog(value = "一口价分类-编辑")
    @ApiOperation(value = "一口价分类-编辑", notes = "一口价分类-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody BuyoutGoodsClass buyoutGoodsClass) {
        buyoutGoodsClassService.updateById(buyoutGoodsClass);
        return Result.OK("编辑成功!");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "一口价分类-通过id删除")
    @ApiOperation(value = "一口价分类-通过id删除", notes = "一口价分类-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        buyoutGoodsClassService.removeById(id);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "一口价分类-批量删除")
    @ApiOperation(value = "一口价分类-批量删除", notes = "一口价分类-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.buyoutGoodsClassService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "一口价分类-通过id查询")
    @ApiOperation(value = "一口价分类-通过id查询", notes = "一口价分类-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        BuyoutGoodsClass buyoutGoodsClass = buyoutGoodsClassService.getById(id);
        return Result.OK(buyoutGoodsClass);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param buyoutGoodsClass
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, BuyoutGoodsClass buyoutGoodsClass) {
        return super.exportXls(request, buyoutGoodsClass, BuyoutGoodsClass.class, "一口价分类");
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
        return super.importExcel(request, response, BuyoutGoodsClass.class);
    }

}
