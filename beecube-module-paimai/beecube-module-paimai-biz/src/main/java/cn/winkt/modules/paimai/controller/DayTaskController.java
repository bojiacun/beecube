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
import cn.winkt.modules.paimai.entity.DayTask;
import cn.winkt.modules.paimai.service.IDayTaskService;
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
 * @Description: 拍卖任务表
 * @Author: jeecg-boot
 * @Date:   2023-05-28
 * @Version: V1.0
 */
@Slf4j
@Api(tags="拍卖任务表")
@RestController
@RequestMapping("/tasks")
public class DayTaskController extends JeecgController<DayTask, IDayTaskService> {
	@Autowired
	private IDayTaskService dayTaskService;
	
	/**
	 * 分页列表查询
	 *
	 * @param dayTask
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "拍卖任务表-分页列表查询")
	@ApiOperation(value="拍卖任务表-分页列表查询", notes="拍卖任务表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(DayTask dayTask,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<DayTask> queryWrapper = QueryGenerator.initQueryWrapper(dayTask, req.getParameterMap());
		Page<DayTask> page = new Page<DayTask>(pageNo, pageSize);
		IPage<DayTask> pageList = dayTaskService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param dayTask
	 * @return
	 */
	@AutoLog(value = "拍卖任务表-添加")
	@ApiOperation(value="拍卖任务表-添加", notes="拍卖任务表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody DayTask dayTask) {
		dayTaskService.save(dayTask);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param dayTask
	 * @return
	 */
	@AutoLog(value = "拍卖任务表-编辑")
	@ApiOperation(value="拍卖任务表-编辑", notes="拍卖任务表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody DayTask dayTask) {
		dayTaskService.updateById(dayTask);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍卖任务表-通过id删除")
	@ApiOperation(value="拍卖任务表-通过id删除", notes="拍卖任务表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		dayTaskService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "拍卖任务表-批量删除")
	@ApiOperation(value="拍卖任务表-批量删除", notes="拍卖任务表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.dayTaskService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍卖任务表-通过id查询")
	@ApiOperation(value="拍卖任务表-通过id查询", notes="拍卖任务表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		DayTask dayTask = dayTaskService.getById(id);
		return Result.OK(dayTask);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param dayTask
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, DayTask dayTask) {
      return super.exportXls(request, dayTask, DayTask.class, "拍卖任务表");
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
      return super.importExcel(request, response, DayTask.class);
  }

}
