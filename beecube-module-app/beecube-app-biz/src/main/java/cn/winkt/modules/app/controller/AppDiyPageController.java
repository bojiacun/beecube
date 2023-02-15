package cn.winkt.modules.app.controller;

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
import cn.winkt.modules.app.entity.AppDiyPage;
import cn.winkt.modules.app.service.IAppDiyPageService;
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
 * @Description: 应用页面设计表
 * @Author: jeecg-boot
 * @Date:   2023-02-15
 * @Version: V1.0
 */
@Slf4j
@Api(tags="应用页面设计表")
@RestController
@RequestMapping("/app/diy/pages")
public class AppDiyPageController extends JeecgController<AppDiyPage, IAppDiyPageService> {
	@Autowired
	private IAppDiyPageService appDiyPageService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appDiyPage
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "应用页面设计表-分页列表查询")
	@ApiOperation(value="应用页面设计表-分页列表查询", notes="应用页面设计表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppDiyPage appDiyPage,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppDiyPage> queryWrapper = QueryGenerator.initQueryWrapper(appDiyPage, req.getParameterMap());
		Page<AppDiyPage> page = new Page<AppDiyPage>(pageNo, pageSize);
		IPage<AppDiyPage> pageList = appDiyPageService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param appDiyPage
	 * @return
	 */
	@AutoLog(value = "应用页面设计表-添加")
	@ApiOperation(value="应用页面设计表-添加", notes="应用页面设计表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppDiyPage appDiyPage) {
		appDiyPageService.save(appDiyPage);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appDiyPage
	 * @return
	 */
	@AutoLog(value = "应用页面设计表-编辑")
	@ApiOperation(value="应用页面设计表-编辑", notes="应用页面设计表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppDiyPage appDiyPage) {
		appDiyPageService.updateById(appDiyPage);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用页面设计表-通过id删除")
	@ApiOperation(value="应用页面设计表-通过id删除", notes="应用页面设计表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appDiyPageService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "应用页面设计表-批量删除")
	@ApiOperation(value="应用页面设计表-批量删除", notes="应用页面设计表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appDiyPageService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用页面设计表-通过id查询")
	@ApiOperation(value="应用页面设计表-通过id查询", notes="应用页面设计表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppDiyPage appDiyPage = appDiyPageService.getById(id);
		return Result.OK(appDiyPage);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appDiyPage
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppDiyPage appDiyPage) {
      return super.exportXls(request, appDiyPage, AppDiyPage.class, "应用页面设计表");
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
      return super.importExcel(request, response, AppDiyPage.class);
  }

}
