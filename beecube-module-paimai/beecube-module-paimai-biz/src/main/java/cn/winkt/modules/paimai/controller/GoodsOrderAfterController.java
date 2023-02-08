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
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
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
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags="订单售后表")
@RestController
@RequestMapping("/paimai/goodsOrderAfter")
public class GoodsOrderAfterController extends JeecgController<GoodsOrderAfter, IGoodsOrderAfterService> {
	@Autowired
	private IGoodsOrderAfterService goodsOrderAfterService;
	
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
	@ApiOperation(value="订单售后表-分页列表查询", notes="订单售后表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(GoodsOrderAfter goodsOrderAfter,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<GoodsOrderAfter> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrderAfter, req.getParameterMap());
		Page<GoodsOrderAfter> page = new Page<GoodsOrderAfter>(pageNo, pageSize);
		IPage<GoodsOrderAfter> pageList = goodsOrderAfterService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param goodsOrderAfter
	 * @return
	 */
	@AutoLog(value = "订单售后表-添加")
	@ApiOperation(value="订单售后表-添加", notes="订单售后表-添加")
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
	@ApiOperation(value="订单售后表-编辑", notes="订单售后表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
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
	@ApiOperation(value="订单售后表-通过id删除", notes="订单售后表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		goodsOrderAfterService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "订单售后表-批量删除")
	@ApiOperation(value="订单售后表-批量删除", notes="订单售后表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
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
	@ApiOperation(value="订单售后表-通过id查询", notes="订单售后表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
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
