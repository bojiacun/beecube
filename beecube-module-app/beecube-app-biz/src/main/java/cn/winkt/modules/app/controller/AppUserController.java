package cn.winkt.modules.app.controller;

import java.util.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.vo.SysUser;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.app.entity.AppUser;
import cn.winkt.modules.app.service.IAppUserService;
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
 * @Description: 应用管理员表
 * @Author: jeecg-boot
 * @Date:   2022-12-18
 * @Version: V1.0
 */
@Slf4j
@Api(tags="应用管理员表")
@RestController
@RequestMapping("/app/users")
public class AppUserController extends JeecgController<AppUser, IAppUserService> {
	@Autowired
	private IAppUserService appUserService;

	@Resource
	private SystemApi systemApi;
	
	/**
	 * 分页列表查询
	 *
	 * @param appUser
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "应用管理员表-分页列表查询")
	@ApiOperation(value="应用管理员表-分页列表查询", notes="应用管理员表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppUser appUser,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppUser> queryWrapper = QueryGenerator.initQueryWrapper(appUser, req.getParameterMap());
		Page<AppUser> page = new Page<AppUser>(pageNo, pageSize);
		IPage<AppUser> pageList = appUserService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	 /**
	  * 绑定管理员
	  */
	 @AutoLog(value = "应用管理员表-绑定管理员")
	 @ApiOperation(value="应用管理员表-绑定管理员", notes="应用管理员表-绑定管理员")
	 @PostMapping(value = "/bind")
	 public Result<?> bind(@RequestBody JSONObject jsonObject) {
		 String appId = jsonObject.getString("appId");
		 String userIdList = jsonObject.getString("userIdList");
		 List<JSONObject> users = systemApi.queryUsersByIds(userIdList);
		 //绑定管理员
		 users.forEach(u -> {
			 AppUser appUser = new AppUser();
			 appUser.setAppId(appId);
			 appUser.setUserId(u.getString("id"));
			 appUser.setUsername(u.getString("username"));

			 appUserService.save(appUser);
		 });
		 return Result.OK("绑定成功！");
	 }

	/**
	 * 添加
	 *
	 * @param appUser
	 * @return
	 */
	@AutoLog(value = "应用管理员表-添加")
	@ApiOperation(value="应用管理员表-添加", notes="应用管理员表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppUser appUser) {
		appUserService.save(appUser);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appUser
	 * @return
	 */
	@AutoLog(value = "应用管理员表-编辑")
	@ApiOperation(value="应用管理员表-编辑", notes="应用管理员表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppUser appUser) {
		appUserService.updateById(appUser);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 解绑用户
	 * @return
	 */
	@AutoLog(value = "应用管理员表-通过id删除")
	@ApiOperation(value="应用管理员表-通过id删除", notes="应用管理员表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="appId",required=true) String appId, @RequestParam(name="userId") String userId) {
		Map<String, Object> deleteMap = new HashMap<>();
		deleteMap.put("app_id", appId);
		deleteMap.put("user_id", userId);
		appUserService.removeByMap(deleteMap);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "应用管理员表-批量删除")
	@ApiOperation(value="应用管理员表-批量删除", notes="应用管理员表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appUserService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用管理员表-通过id查询")
	@ApiOperation(value="应用管理员表-通过id查询", notes="应用管理员表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppUser appUser = appUserService.getById(id);
		return Result.OK(appUser);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appUser
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppUser appUser) {
      return super.exportXls(request, appUser, AppUser.class, "应用管理员表");
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
      return super.importExcel(request, response, AppUser.class);
  }

}
