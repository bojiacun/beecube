package cn.winkt.modules.app.controller;

import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import cn.winkt.modules.app.entity.AppModule;
import cn.winkt.modules.app.service.IAppModuleService;
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
 * @Description: 应用模块
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
@Slf4j
@Api(tags="应用模块")
@RestController
@RequestMapping("/app/modules")
public class AppModuleController extends JeecgController<AppModule, IAppModuleService> {
	@Autowired
	private IAppModuleService appModuleService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appModule
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "应用模块-分页列表查询")
	@ApiOperation(value="应用模块-分页列表查询", notes="应用模块-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppModule appModule,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppModule> queryWrapper = QueryGenerator.initQueryWrapper(appModule, req.getParameterMap());
		Page<AppModule> page = new Page<AppModule>(pageNo, pageSize);
		IPage<AppModule> pageList = appModuleService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param appModule
	 * @return
	 */
	@AutoLog(value = "应用模块-添加")
	@ApiOperation(value="应用模块-添加", notes="应用模块-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppModule appModule) {
		appModuleService.save(appModule);
		return Result.OK("添加成功！");
	}

	@PostMapping("/register")
	@AutoLog(value = "应用模块-注册")
	@ApiOperation(value="应用模块-注册", notes="应用模块-注册")
	public Result<?> register(@RequestBody AppModule appModule) {
		if(appModuleService.queryByIdentify(appModule.getIdentify()) != null) {
			throw new JeecgBootException("模块已经注册，请勿重复注册");
		}
		appModuleService.save(appModule);
		return Result.OK("注册成功");
	}

	@PutMapping("/install/{id}")
	@AutoLog(value = "应用模块-安装")
	@ApiOperation(value="应用模块-安装", notes="应用模块-安装")
	public Result<?> installModule(@PathVariable String id) {
		AppModule appModule = appModuleService.getById(id);
		if(appModule == null) {
			throw new JeecgBootException("找不到模块 "+id);
		}
		if(appModule.getStatus() == null || appModule.getStatus() != 0) {
			throw new JeecgBootException("模块状态异常，不可安装");
		}
		JSONObject manifest = JSONObject.parseObject(appModule.getManifest());
		if(manifest == null) {
			throw new JeecgBootException("模块无可安装信息");
		}


		//以下执行模块安装操作

		//安装路由

		//安装菜单

		//调用模块安装方法

		//执行安装成功后续操作

		appModule.setStatus(1);

		appModuleService.save(appModule);


		return Result.OK(true);
	}

	/**
	 * 编辑
	 *
	 * @param appModule
	 * @return
	 */
	@AutoLog(value = "应用模块-编辑")
	@ApiOperation(value="应用模块-编辑", notes="应用模块-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppModule appModule) {
		appModuleService.updateById(appModule);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用模块-通过id删除")
	@ApiOperation(value="应用模块-通过id删除", notes="应用模块-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appModuleService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "应用模块-批量删除")
	@ApiOperation(value="应用模块-批量删除", notes="应用模块-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appModuleService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用模块-通过id查询")
	@ApiOperation(value="应用模块-通过id查询", notes="应用模块-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppModule appModule = appModuleService.getById(id);
		return Result.OK(appModule);
	}

	@GetMapping(value = "/queryByIdentify")
	@AutoLog(value = "应用模块-通过identify查询")
	@ApiOperation(value="应用模块-通过identify查询", notes="应用模块-通过identify查询")
	public boolean queryByIdentify(@RequestParam(name = "identify") String identify) {
		return appModuleService.queryByIdentify(identify) != null;
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appModule
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppModule appModule) {
      return super.exportXls(request, appModule, AppModule.class, "应用模块");
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
      return super.importExcel(request, response, AppModule.class);
  }

}
