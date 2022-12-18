package cn.winkt.modules.app.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.entity.AppModuleMenu;
import cn.winkt.modules.app.service.IAppModuleMenuService;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
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
 * @Description: 模块路由映射表
 * @Author: jeecg-boot
 * @Date:   2022-12-17
 * @Version: V1.0
 */
@Slf4j
@Api(tags="模块路由映射表")
@RestController
@RequestMapping("/app/appModuleMenu")
public class AppModuleMenuController extends JeecgController<AppModuleMenu, IAppModuleMenuService> {
	@Autowired
	private IAppModuleMenuService appModuleMenuService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appModuleMenu
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-分页列表查询")
	@ApiOperation(value="模块路由映射表-分页列表查询", notes="模块路由映射表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppModuleMenu appModuleMenu,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppModuleMenu> queryWrapper = QueryGenerator.initQueryWrapper(appModuleMenu, req.getParameterMap());
		Page<AppModuleMenu> page = new Page<AppModuleMenu>(pageNo, pageSize);
		IPage<AppModuleMenu> pageList = appModuleMenuService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param appModuleMenu
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-添加")
	@ApiOperation(value="模块路由映射表-添加", notes="模块路由映射表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppModuleMenu appModuleMenu) {
		appModuleMenuService.save(appModuleMenu);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appModuleMenu
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-编辑")
	@ApiOperation(value="模块路由映射表-编辑", notes="模块路由映射表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppModuleMenu appModuleMenu) {
		appModuleMenuService.updateById(appModuleMenu);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-通过id删除")
	@ApiOperation(value="模块路由映射表-通过id删除", notes="模块路由映射表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appModuleMenuService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-批量删除")
	@ApiOperation(value="模块路由映射表-批量删除", notes="模块路由映射表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appModuleMenuService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-通过id查询")
	@ApiOperation(value="模块路由映射表-通过id查询", notes="模块路由映射表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppModuleMenu appModuleMenu = appModuleMenuService.getById(id);
		return Result.OK(appModuleMenu);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appModuleMenu
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppModuleMenu appModuleMenu) {
      return super.exportXls(request, appModuleMenu, AppModuleMenu.class, "模块路由映射表");
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
      return super.importExcel(request, response, AppModuleMenu.class);
  }

}
