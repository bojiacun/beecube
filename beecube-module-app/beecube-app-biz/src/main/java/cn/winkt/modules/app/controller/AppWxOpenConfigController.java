package cn.winkt.modules.app.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.entity.AppSetting;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.app.entity.AppWxOpenConfig;
import cn.winkt.modules.app.service.IAppWxOpenConfigService;
import java.util.Date;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.config.AppContext;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

 /**
 * @Description: 微信开放平台配置表
 * @Author: jeecg-boot
 * @Date:   2023-04-01
 * @Version: V1.0
 */
@Slf4j
@Api(tags="微信开放平台配置表")
@RestController
@RequestMapping("/app/wxopen/configs")
public class AppWxOpenConfigController extends JeecgController<AppWxOpenConfig, IAppWxOpenConfigService> {
	@Autowired
	private IAppWxOpenConfigService appWxOpenConfigService;
	
	/**
	 * 列表查询
	 *
	 * @return
	 */
	@AutoLog(value = "微信开放平台配置表-分页列表查询")
	@ApiOperation(value="微信开放平台配置表-分页列表查询", notes="微信开放平台配置表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryList() {
		return Result.OK(appWxOpenConfigService.list());
	}

	 @AutoLog(value = "微信开放平台配置表-编辑")
	 @ApiOperation(value="微信开放平台配置表-编辑", notes="微信开放平台配置表-编辑")
	 @RequestMapping(value = "/updateAll", method = RequestMethod.POST)
	 @Transactional(rollbackFor = Exception.class)
	 public Result<?> updateAll(@RequestBody JSONObject jsonObject) {
		 LambdaQueryWrapper<AppWxOpenConfig> removeQueryWrapper = new LambdaQueryWrapper<>();
		 appWxOpenConfigService.remove(removeQueryWrapper);

		 jsonObject.keySet().forEach(key-> {
			 AppWxOpenConfig config = new AppWxOpenConfig();
			 config.setSettingValue(jsonObject.getString(key));
			 config.setSettingKey(key);
			 appWxOpenConfigService.save(config);
		 });
		 return Result.OK("更新成功!");
	 }
}
