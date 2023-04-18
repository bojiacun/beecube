package cn.winkt.modules.app.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.app.entity.AppMemberAddress;
import cn.winkt.modules.app.service.IAppMemberAddressService;
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
 * @Description: 应用会员地址信息表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags="应用会员地址信息表")
@RestController
@RequestMapping("/members/addresses")
public class AppMemberAddressController extends JeecgController<AppMemberAddress, IAppMemberAddressService> {
	@Autowired
	private IAppMemberAddressService appMemberAddressService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appMemberAddress
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "应用会员地址信息表-分页列表查询")
	@ApiOperation(value="应用会员地址信息表-分页列表查询", notes="应用会员地址信息表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppMemberAddress appMemberAddress,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppMemberAddress> queryWrapper = QueryGenerator.initQueryWrapper(appMemberAddress, req.getParameterMap());
		Page<AppMemberAddress> page = new Page<AppMemberAddress>(pageNo, pageSize);
		IPage<AppMemberAddress> pageList = appMemberAddressService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param appMemberAddress
	 * @return
	 */
	@AutoLog(value = "应用会员地址信息表-添加")
	@ApiOperation(value="应用会员地址信息表-添加", notes="应用会员地址信息表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppMemberAddress appMemberAddress) {
		appMemberAddressService.save(appMemberAddress);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appMemberAddress
	 * @return
	 */
	@AutoLog(value = "应用会员地址信息表-编辑")
	@ApiOperation(value="应用会员地址信息表-编辑", notes="应用会员地址信息表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppMemberAddress appMemberAddress) {
		LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
		if(appMemberAddress.getIsDefault() != null && appMemberAddress.getIsDefault() == 1) {
			//将其他的地址设置不默认
			LambdaUpdateWrapper<AppMemberAddress> updateWrapper = new LambdaUpdateWrapper<>();
			updateWrapper.set(AppMemberAddress::getIsDefault, 0);
			updateWrapper.eq(AppMemberAddress::getMemberId, loginUser.getId());
			appMemberAddressService.update(updateWrapper);
		}
		appMemberAddressService.updateById(appMemberAddress);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用会员地址信息表-通过id删除")
	@ApiOperation(value="应用会员地址信息表-通过id删除", notes="应用会员地址信息表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appMemberAddressService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "应用会员地址信息表-批量删除")
	@ApiOperation(value="应用会员地址信息表-批量删除", notes="应用会员地址信息表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appMemberAddressService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用会员地址信息表-通过id查询")
	@ApiOperation(value="应用会员地址信息表-通过id查询", notes="应用会员地址信息表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppMemberAddress appMemberAddress = appMemberAddressService.getById(id);
		return Result.OK(appMemberAddress);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appMemberAddress
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppMemberAddress appMemberAddress) {
      return super.exportXls(request, appMemberAddress, AppMemberAddress.class, "应用会员地址信息表");
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
      return super.importExcel(request, response, AppMemberAddress.class);
  }

}
