package cn.winkt.modules.app.controller;

import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.entity.AppModuleRole;
import cn.winkt.modules.app.service.IAppModuleRoleService;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
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
@RequestMapping("ModuleRole")
public class AppModuleRoleController extends JeecgController<AppModuleRole, IAppModuleRoleService> {
	@Autowired
	private IAppModuleRoleService appModuleRoleService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appModuleRole
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-分页列表查询")
	@ApiOperation(value="模块路由映射表-分页列表查询", notes="模块路由映射表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppModuleRole appModuleRole,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppModuleRole> queryWrapper = QueryGenerator.initQueryWrapper(appModuleRole, req.getParameterMap());
		Page<AppModuleRole> page = new Page<AppModuleRole>(pageNo, pageSize);
		IPage<AppModuleRole> pageList = appModuleRoleService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param appModuleRole
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-添加")
	@ApiOperation(value="模块路由映射表-添加", notes="模块路由映射表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppModuleRole appModuleRole) {
		appModuleRoleService.save(appModuleRole);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appModuleRole
	 * @return
	 */
	@AutoLog(value = "模块路由映射表-编辑")
	@ApiOperation(value="模块路由映射表-编辑", notes="模块路由映射表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppModuleRole appModuleRole) {
		appModuleRoleService.updateById(appModuleRole);
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
		appModuleRoleService.removeById(id);
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
		this.appModuleRoleService.removeByIds(Arrays.asList(ids.split(",")));
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
		AppModuleRole appModuleRole = appModuleRoleService.getById(id);
		return Result.OK(appModuleRole);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appModuleRole
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppModuleRole appModuleRole) {
      return super.exportXls(request, appModuleRole, AppModuleRole.class, "模块路由映射表");
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
      return super.importExcel(request, response, AppModuleRole.class);
  }

}
