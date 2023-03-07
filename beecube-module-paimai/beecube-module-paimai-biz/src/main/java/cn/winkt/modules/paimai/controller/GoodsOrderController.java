package cn.winkt.modules.paimai.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.paimai.vo.OrderVo;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.GoodsOrder;
import cn.winkt.modules.paimai.service.IGoodsOrderService;
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
 * @Description: 订单表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags="订单表")
@RestController
@RequestMapping("/paimai/orders")
public class GoodsOrderController extends JeecgController<GoodsOrder, IGoodsOrderService> {
	@Autowired
	private IGoodsOrderService goodsOrderService;
	
	/**
	 * 分页列表查询
	 *
	 * @param goodsOrder
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "订单表-分页列表查询")
	@ApiOperation(value="订单表-分页列表查询", notes="订单表-分页列表查询")
	@GetMapping(value = "/list")
	@AutoDict
	public Result<?> queryPageList(GoodsOrder goodsOrder,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<GoodsOrder> queryWrapper = QueryGenerator.initQueryWrapper(goodsOrder, req.getParameterMap());
		Page<GoodsOrder> page = new Page<>(pageNo, pageSize);
		IPage<GoodsOrder> pageList = goodsOrderService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param goodsOrder
	 * @return
	 */
	@AutoLog(value = "订单表-添加")
	@ApiOperation(value="订单表-添加", notes="订单表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody GoodsOrder goodsOrder) {
		goodsOrderService.save(goodsOrder);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param goodsOrder
	 * @return
	 */
	@AutoLog(value = "订单表-编辑")
	@ApiOperation(value="订单表-编辑", notes="订单表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody GoodsOrder goodsOrder) {
		goodsOrderService.updateById(goodsOrder);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "订单表-通过id删除")
	@ApiOperation(value="订单表-通过id删除", notes="订单表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		goodsOrderService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "订单表-批量删除")
	@ApiOperation(value="订单表-批量删除", notes="订单表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.goodsOrderService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "订单表-通过id查询")
	@ApiOperation(value="订单表-通过id查询", notes="订单表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		GoodsOrder goodsOrder = goodsOrderService.getById(id);
		return Result.OK(goodsOrder);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param goodsOrder
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, GoodsOrder goodsOrder) {
      return super.exportXls(request, goodsOrder, GoodsOrder.class, "订单表");
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
      return super.importExcel(request, response, GoodsOrder.class);
  }

}
