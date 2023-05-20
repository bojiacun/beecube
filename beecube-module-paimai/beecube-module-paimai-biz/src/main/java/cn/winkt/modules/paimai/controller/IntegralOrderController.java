package cn.winkt.modules.paimai.controller;

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
import cn.winkt.modules.paimai.entity.IntegralOrder;
import cn.winkt.modules.paimai.service.IIntegralOrderService;
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
 * @Description: 积分商品分类
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Slf4j
@Api(tags="积分商品分类")
@RestController
@RequestMapping("/integral/orders")
public class IntegralOrderController extends JeecgController<IntegralOrder, IIntegralOrderService> {
	@Autowired
	private IIntegralOrderService integralOrderService;
	
	/**
	 * 分页列表查询
	 *
	 * @param integralOrder
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "积分商品分类-分页列表查询")
	@ApiOperation(value="积分商品分类-分页列表查询", notes="积分商品分类-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(IntegralOrder integralOrder,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<IntegralOrder> queryWrapper = QueryGenerator.initQueryWrapper(integralOrder, req.getParameterMap());
		Page<IntegralOrder> page = new Page<IntegralOrder>(pageNo, pageSize);
		IPage<IntegralOrder> pageList = integralOrderService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param integralOrder
	 * @return
	 */
	@AutoLog(value = "积分商品分类-添加")
	@ApiOperation(value="积分商品分类-添加", notes="积分商品分类-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody IntegralOrder integralOrder) {
		integralOrderService.save(integralOrder);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param integralOrder
	 * @return
	 */
	@AutoLog(value = "积分商品分类-编辑")
	@ApiOperation(value="积分商品分类-编辑", notes="积分商品分类-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody IntegralOrder integralOrder) {
		integralOrderService.updateById(integralOrder);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "积分商品分类-通过id删除")
	@ApiOperation(value="积分商品分类-通过id删除", notes="积分商品分类-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		integralOrderService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "积分商品分类-批量删除")
	@ApiOperation(value="积分商品分类-批量删除", notes="积分商品分类-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.integralOrderService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "积分商品分类-通过id查询")
	@ApiOperation(value="积分商品分类-通过id查询", notes="积分商品分类-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		IntegralOrder integralOrder = integralOrderService.getById(id);
		return Result.OK(integralOrder);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param integralOrder
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, IntegralOrder integralOrder) {
      return super.exportXls(request, integralOrder, IntegralOrder.class, "积分商品分类");
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
      return super.importExcel(request, response, IntegralOrder.class);
  }

}
