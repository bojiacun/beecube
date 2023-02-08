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
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.IPerformanceService;
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
@RequestMapping("/paimai/performance")
public class PerformanceController extends JeecgController<Performance, IPerformanceService> {
	@Autowired
	private IPerformanceService performanceService;
	
	/**
	 * 分页列表查询
	 *
	 * @param performance
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "订单售后表-分页列表查询")
	@ApiOperation(value="订单售后表-分页列表查询", notes="订单售后表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(Performance performance,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<Performance> queryWrapper = QueryGenerator.initQueryWrapper(performance, req.getParameterMap());
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
	@AutoLog(value = "订单售后表-添加")
	@ApiOperation(value="订单售后表-添加", notes="订单售后表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody Performance performance) {
		performanceService.save(performance);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param performance
	 * @return
	 */
	@AutoLog(value = "订单售后表-编辑")
	@ApiOperation(value="订单售后表-编辑", notes="订单售后表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody Performance performance) {
		performanceService.updateById(performance);
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
		performanceService.removeById(id);
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
		this.performanceService.removeByIds(Arrays.asList(ids.split(",")));
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
      return super.exportXls(request, performance, Performance.class, "订单售后表");
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
