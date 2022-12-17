package cn.winkt.modules.app.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.vo.AppGateway;
import cn.winkt.modules.app.vo.AppManifest;
import cn.winkt.modules.app.vo.AppMenu;
import com.alibaba.fastjson.JSONObject;
import io.seata.core.context.RootContext;
import io.seata.spring.annotation.GlobalTransactional;
import org.jeecg.common.api.CommonAPI;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
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

	@Resource
	private SystemApi systemApi;

	@Resource
	private RestTemplate restTemplate;


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
	@GlobalTransactional
	public Result<?> installModule(@PathVariable String id) {
		AppModule appModule = appModuleService.getById(id);
		if(appModule == null) {
			throw new JeecgBootException("找不到模块 "+id);
		}
		if(appModule.getStatus() == null || appModule.getStatus() == 1) {
			throw new JeecgBootException("模块状态异常，不可安装");
		}
		JSONObject manifest = JSONObject.parseObject(appModule.getManifest());
		if(manifest == null) {
			throw new JeecgBootException("模块无可安装信息");
		}

		log.info("事务XID为：{}", RootContext.getXID());

		//以下执行模块安装操作
		AppManifest appManifest = JSONObject.parseObject(appModule.getManifest(), AppManifest.class);

		//安装路由
		AppGateway appGateway = appManifest.getGateway();
		JSONObject appGatewayJson = new JSONObject();
		appGatewayJson.put("name", appGateway.getName());
		appGatewayJson.put("status", appGateway.getStatus());
		appGatewayJson.put("filters", JSONObject.toJSONString(appGateway.getFilters()));
		appGatewayJson.put("predicates", JSONObject.toJSONString(appGateway.getPredicates()));
		appGatewayJson.put("routerId", appGateway.getRouterId());
		appGatewayJson.put("uri", appGateway.getUri());

		JSONObject postData = new JSONObject();
		postData.put("router", appGatewayJson);
//		systemApi.gatewayUpdateAll(postData);

		//安装菜单
		Arrays.stream(appManifest.getMenus()).forEach(appMenu -> {
			installMenu(appMenu, appModule, null);
		});
		if(systemApi != null) {
			throw new JeecgBootException("测试分布式事务");
		}

		//调用模块安装方法
		restTemplate.put("lb://"+ appGateway.getRouterId()+appManifest.getInstallUrl(), null);

		//执行安装成功后续操作

		appModule.setStatus(1);

		appModuleService.updateById(appModule);


		return Result.OK(true);
	}
	@PutMapping("/uninstall/{id}")
	@AutoLog(value = "应用模块-卸载")
	@ApiOperation(value="应用模块-卸载", notes="应用模块-卸载")
	public Result<?> uninstallModule(@PathVariable String id) {
		AppModule appModule = appModuleService.getById(id);
		if(appModule == null) {
			throw new JeecgBootException("找不到模块 "+id);
		}
		if(appModule.getStatus() == null || appModule.getStatus() != 1) {
			throw new JeecgBootException("模块状态异常，不可卸载");
		}
		AppManifest appManifest = JSONObject.parseObject(appModule.getManifest(), AppManifest.class);
		if(appManifest == null) {
			throw new JeecgBootException("没有找到模块的安装信息");
		}
		AppGateway appGateway = appManifest.getGateway();
		Result<?> result = systemApi.gatewayList();
		List<JSONObject> gateways = (List<JSONObject>) result.getResult();
		//卸载路由
		gateways.forEach(o -> {
			if(o.getString("routerId").equals(appManifest.getGateway().getRouterId())) {
				String deleteId = o.getString("id");
				systemApi.delete(deleteId);
			}
		});
		//卸载菜单
		AppMenu searchMenu = new AppMenu();
		searchMenu.setComponentName(appModule.getIdentify());
		List<AppMenu> menus = systemApi.listMenu(searchMenu).getResult();
		if(menus != null) {
			List<String> ids = new ArrayList<>();
			menus.forEach(m -> {
				takeMenuId(m, ids);
			});
			log.info("要删除的菜单有 {}", String.join(",", ids));
			systemApi.deleteBatch(String.join(",", ids));
		}
		//调用模块卸载方法
		restTemplate.put("lb://"+ appGateway.getRouterId()+appManifest.getUninstallUrl(), null);
		//执行卸载后操作
		appModule.setStatus(2);

		appModuleService.updateById(appModule);

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



  private void installMenu(AppMenu menu, AppModule appModule, AppMenu parent) {
	  menu.setComponentName(appModule.getIdentify());
	  if(parent != null) {
		  menu.setParentId(parent.getId());
	  }
	  AppMenu p = systemApi.createMenu(menu).getResult();
	  if(menu.getChildren() != null) {
		  Arrays.stream(menu.getChildren()).forEach(child -> {
			  installMenu(child, appModule, p);
		  });
	  }
  }
  private void takeMenuId(AppMenu menu, List<String> ids) {
	  ids.add(menu.getId());
	  if(menu.getChildren() != null) {
		  Arrays.stream(menu.getChildren()).forEach(m -> {
			  takeMenuId(m, ids);
		  });
	  }
  }
}
