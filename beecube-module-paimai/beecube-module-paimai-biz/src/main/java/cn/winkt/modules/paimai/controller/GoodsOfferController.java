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
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IPerformanceService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.GoodsOffer;
import cn.winkt.modules.paimai.service.IGoodsOfferService;

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
 * @Description: 出价记录表
 * @Author: jeecg-boot
 * @Date: 2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "出价记录表")
@RestController
@RequestMapping("/offers")
public class GoodsOfferController extends JeecgController<GoodsOffer, IGoodsOfferService> {
    @Autowired
    private IGoodsOfferService goodsOfferService;

    @Resource
    private IGoodsService goodsService;

    @Resource
    private IPerformanceService performanceService;

    /**
     * 分页列表查询
     *
     * @param goodsOffer
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "出价记录表-分页列表查询")
    @ApiOperation(value = "出价记录表-分页列表查询", notes = "出价记录表-分页列表查询")
    @GetMapping(value = "/list")
    @AutoDict
    public Result<?> queryPageList(GoodsOffer goodsOffer,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<GoodsOffer> queryWrapper = QueryGenerator.initQueryWrapper(goodsOffer, req.getParameterMap());
        Page<GoodsOffer> page = new Page<GoodsOffer>(pageNo, pageSize);
        IPage<GoodsOffer> pageList = goodsOfferService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param goodsOffer
     * @return
     */
    @AutoLog(value = "出价记录表-添加")
    @ApiOperation(value = "出价记录表-添加", notes = "出价记录表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody GoodsOffer goodsOffer) {
        goodsOfferService.save(goodsOffer);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param goodsOffer
     * @return
     */
    @AutoLog(value = "出价记录表-编辑")
    @ApiOperation(value = "出价记录表-编辑", notes = "出价记录表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody GoodsOffer goodsOffer) {
        goodsOfferService.updateById(goodsOffer);
        return Result.OK("编辑成功!");
    }



    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "出价记录表-通过id删除")
    @ApiOperation(value = "出价记录表-通过id删除", notes = "出价记录表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        goodsOfferService.removeById(id);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "出价记录表-批量删除")
    @ApiOperation(value = "出价记录表-批量删除", notes = "出价记录表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.goodsOfferService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "出价记录表-通过id查询")
    @ApiOperation(value = "出价记录表-通过id查询", notes = "出价记录表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        GoodsOffer goodsOffer = goodsOfferService.getById(id);
        return Result.OK(goodsOffer);
    }

    /**
     * 导出excel
     *
     * @param request
     * @param goodsOffer
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, GoodsOffer goodsOffer) {
        return super.exportXls(request, goodsOffer, GoodsOffer.class, "出价记录表");
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
        return super.importExcel(request, response, GoodsOffer.class);
    }

}
