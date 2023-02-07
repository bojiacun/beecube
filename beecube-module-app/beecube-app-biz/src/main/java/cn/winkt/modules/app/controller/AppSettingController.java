package cn.winkt.modules.app.controller;

import java.util.Arrays;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppSettingService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.config.AppContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

 /**
 * @Description: 应用配置表
 * @Author: jeecg-boot
 * @Date:   2022-12-19
 * @Version: V1.0
 */
@Slf4j
@Api(tags="应用配置表")
@RestController
@RequestMapping("/app/settings")
public class AppSettingController extends JeecgController<AppSetting, IAppSettingService> {
	@Autowired
	private IAppSettingService appSettingService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appSetting
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "应用配置表-分页列表查询")
	@ApiOperation(value="应用配置表-分页列表查询", notes="应用配置表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppSetting appSetting,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppSetting> queryWrapper = QueryGenerator.initQueryWrapper(appSetting, req.getParameterMap());
		Page<AppSetting> page = new Page<AppSetting>(pageNo, pageSize);
		IPage<AppSetting> pageList = appSettingService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	 @AutoLog(value = "应用配置表-应用所有配置")
	 @ApiOperation(value="应用配置表-应用所有配置", notes="应用配置表-应用所有配置")
	 @GetMapping(value = "/all")
	 public Result<?> queryAllByAppId() {
		 LambdaQueryWrapper<AppSetting> queryWrapper = new LambdaQueryWrapper<>();
		 queryWrapper.eq(AppSetting::getAppId, AppContext.getApp());

		 List<AppSetting> pageList = appSettingService.list(queryWrapper);
		 return Result.OK(pageList);
	 }
	/**
	 * 添加
	 *
	 * @param appSetting
	 * @return
	 */
	@AutoLog(value = "应用配置表-添加")
	@ApiOperation(value="应用配置表-添加", notes="应用配置表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppSetting appSetting) {
		appSettingService.save(appSetting);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appSetting
	 * @return
	 */
	@AutoLog(value = "应用配置表-编辑")
	@ApiOperation(value="应用配置表-编辑", notes="应用配置表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppSetting appSetting) {
		appSettingService.updateById(appSetting);
		return Result.OK("编辑成功!");
	}

	 /**
	  * 批量更新
	  *
	  * @return
	  */
	 @AutoLog(value = "应用配置表-编辑")
	 @ApiOperation(value="应用配置表-编辑", notes="应用配置表-编辑")
	 @RequestMapping(value = "/updateAll", method = RequestMethod.POST)
	 @Transactional
	 public Result<?> updateAll(@RequestBody JSONObject jsonObject, @RequestParam String group) {
		 //分组更新设置
		 String appId = AppContext.getApp();
		 if(StringUtils.isEmpty(appId)) {
			 return Result.error("找不到当前应用ID");
		 }
		 //先移除group的配置，然后再次全量插入
		 LambdaQueryWrapper<AppSetting> removeQueryWrapper = new LambdaQueryWrapper<>();
		 removeQueryWrapper.eq(AppSetting::getGroupKey, group);
		 removeQueryWrapper.eq(AppSetting::getAppId, appId);
		 appSettingService.remove(removeQueryWrapper);

		 jsonObject.keySet().forEach(key-> {
			 AppSetting appSetting = new AppSetting();
			 appSetting.setAppId(appId);
			 appSetting.setSettingValue(jsonObject.getString(key));
			 appSetting.setSettingKey(key);
			 appSetting.setGroupKey(group);
			 appSettingService.save(appSetting);
		 });
		 return Result.OK("更新成功!");
	 }
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用配置表-通过id删除")
	@ApiOperation(value="应用配置表-通过id删除", notes="应用配置表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appSettingService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "应用配置表-批量删除")
	@ApiOperation(value="应用配置表-批量删除", notes="应用配置表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appSettingService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用配置表-通过id查询")
	@ApiOperation(value="应用配置表-通过id查询", notes="应用配置表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppSetting appSetting = appSettingService.getById(id);
		return Result.OK(appSetting);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appSetting
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppSetting appSetting) {
      return super.exportXls(request, appSetting, AppSetting.class, "应用配置表");
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
      return super.importExcel(request, response, AppSetting.class);
  }

}
