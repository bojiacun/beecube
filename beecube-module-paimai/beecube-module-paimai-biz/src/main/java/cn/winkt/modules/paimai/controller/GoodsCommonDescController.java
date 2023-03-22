package cn.winkt.modules.paimai.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.GoodsCommonDesc;
import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
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
 * @Description: 拍品公共信息表
 * @Author: jeecg-boot
 * @Date:   2023-02-09
 * @Version: V1.0
 */
@Slf4j
@Api(tags="拍品公共信息表")
@RestController
@RequestMapping("/paimai/settings")
public class GoodsCommonDescController extends JeecgController<GoodsCommonDesc, IGoodsCommonDescService> {
	@Autowired
	private IGoodsCommonDescService goodsCommonDescService;
	
	/**
	 * 分页列表查询
	 *
	 * @param goodsCommonDesc
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "拍品公共信息表-分页列表查询")
	@ApiOperation(value="拍品公共信息表-分页列表查询", notes="拍品公共信息表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(GoodsCommonDesc goodsCommonDesc,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<GoodsCommonDesc> queryWrapper = QueryGenerator.initQueryWrapper(goodsCommonDesc, req.getParameterMap());
		Page<GoodsCommonDesc> page = new Page<GoodsCommonDesc>(pageNo, pageSize);
		IPage<GoodsCommonDesc> pageList = goodsCommonDescService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	 @AutoLog(value = "拍品公共信息表-所有")
	 @ApiOperation(value="拍品公共信息表-所有", notes="拍品公共信息表-所有")
	 @GetMapping(value = "/all")
	 public Result<?> allPageList() {
		 return Result.OK(goodsCommonDescService.list());
	 }
	 @AutoLog(value = "拍品配置表-编辑")
	 @ApiOperation(value="拍品配置表-编辑", notes="拍品配置表-编辑")
	 @RequestMapping(value = "/updateAll", method = RequestMethod.POST)
	 @Transactional(rollbackFor = Exception.class)
	 public Result<?> updateAll(@RequestBody JSONObject jsonObject) {
		 //分组更新设置
		 String appId = AppContext.getApp();
		 if(StringUtils.isEmpty(appId)) {
			 return Result.error("找不到当前应用ID");
		 }
		 //先移除group的配置，然后再次全量插入
		 LambdaQueryWrapper<GoodsCommonDesc> removeQueryWrapper = new LambdaQueryWrapper<>();
		 removeQueryWrapper.eq(GoodsCommonDesc::getAppId, appId);
		 goodsCommonDescService.remove(removeQueryWrapper);

		 jsonObject.keySet().forEach(key-> {
			 GoodsCommonDesc appSetting = new GoodsCommonDesc();
			 appSetting.setAppId(appId);
			 appSetting.setDescValue(jsonObject.getString(key));
			 appSetting.setDescKey(key);
			 goodsCommonDescService.save(appSetting);
		 });
		 return Result.OK("更新成功!");
	 }
	/**
	 * 添加
	 *
	 * @param goodsCommonDesc
	 * @return
	 */
	@AutoLog(value = "拍品公共信息表-添加")
	@ApiOperation(value="拍品公共信息表-添加", notes="拍品公共信息表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody GoodsCommonDesc goodsCommonDesc) {
		goodsCommonDescService.save(goodsCommonDesc);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param goodsCommonDesc
	 * @return
	 */
	@AutoLog(value = "拍品公共信息表-编辑")
	@ApiOperation(value="拍品公共信息表-编辑", notes="拍品公共信息表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody GoodsCommonDesc goodsCommonDesc) {
		goodsCommonDescService.updateById(goodsCommonDesc);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍品公共信息表-通过id删除")
	@ApiOperation(value="拍品公共信息表-通过id删除", notes="拍品公共信息表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		goodsCommonDescService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "拍品公共信息表-批量删除")
	@ApiOperation(value="拍品公共信息表-批量删除", notes="拍品公共信息表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.goodsCommonDescService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍品公共信息表-通过id查询")
	@ApiOperation(value="拍品公共信息表-通过id查询", notes="拍品公共信息表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		GoodsCommonDesc goodsCommonDesc = goodsCommonDescService.getById(id);
		return Result.OK(goodsCommonDesc);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param goodsCommonDesc
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, GoodsCommonDesc goodsCommonDesc) {
      return super.exportXls(request, goodsCommonDesc, GoodsCommonDesc.class, "拍品公共信息表");
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
      return super.importExcel(request, response, GoodsCommonDesc.class);
  }

}
