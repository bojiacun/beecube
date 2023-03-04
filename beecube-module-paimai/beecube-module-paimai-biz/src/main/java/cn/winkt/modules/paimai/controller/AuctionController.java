package cn.winkt.modules.paimai.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.IPerformanceService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.Auction;
import cn.winkt.modules.paimai.service.IAuctionService;
import java.util.Date;
import java.util.stream.Collectors;

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
 * @Description: 拍卖会表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags="拍卖会表")
@RestController
@RequestMapping("/paimai/auctions")
public class AuctionController extends JeecgController<Auction, IAuctionService> {
	@Autowired
	private IAuctionService auctionService;

	@Resource
	private IPerformanceService performanceService;
	/**
	 * 分页列表查询
	 *
	 * @param auction
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "拍卖会表-分页列表查询")
	@ApiOperation(value="拍卖会表-分页列表查询", notes="拍卖会表-分页列表查询")
	@GetMapping(value = "/list")
	@AutoDict
	public Result<?> queryPageList(Auction auction,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<Auction> queryWrapper = QueryGenerator.initQueryWrapper(auction, req.getParameterMap());
		Page<Auction> page = new Page<Auction>(pageNo, pageSize);
		IPage<Auction> pageList = auctionService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param auction
	 * @return
	 */
	@AutoLog(value = "拍卖会表-添加")
	@ApiOperation(value="拍卖会表-添加", notes="拍卖会表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody Auction auction) {
		auctionService.save(auction);
		return Result.OK("添加成功！");
	}
	 @AutoLog(value = "拍卖会表-添加专场")
	 @ApiOperation(value = "拍卖会表-添加专场", notes = "拍卖会表-添加专场")
	 @PostMapping(value = "/performances/add")
	 public Result<?> addPerformances(@RequestBody JSONObject jsonObject) {
		 String auctionId = jsonObject.getString("auctionId");
		 Auction auction = auctionService.getById(auctionId);
		 String perfIds = jsonObject.getString("perfIds");
		 if(StringUtils.isEmpty(perfIds)) {
			 throw new JeecgBootException("请选择专场");
		 }
		 LambdaQueryWrapper<Performance> queryWrapper = new LambdaQueryWrapper<>();
		 queryWrapper.in(Performance::getId, Arrays.stream(perfIds.split(",")).collect(Collectors.toList()));
		 List<Performance> performances = performanceService.list(queryWrapper);
		 for (Performance p:performances) {
			 p.setAuctionId(auctionId);
		 }
		 performanceService.updateBatchById(performances);
		 return Result.OK("添加成功！");
	 }
	 @AutoLog(value = "拍卖会表-移除专场")
	 @ApiOperation(value = "拍卖会表-移除专场", notes = "拍卖会表-移除专场")
	 @PostMapping(value = "/performances/remove")
	 public Result<?> removePerformances(@RequestBody JSONObject jsonObject) {
		 String auctionId = jsonObject.getString("auctionId");
		 String perfIds = jsonObject.getString("perfIds");
		 if(StringUtils.isEmpty(perfIds)) {
			 throw new JeecgBootException("请选择专场");
		 }
		 LambdaUpdateWrapper<Performance> updateWrapper = new LambdaUpdateWrapper<>();
		 updateWrapper.in(Performance::getId, Arrays.stream(perfIds.split(",")).collect(Collectors.toList()));
		 updateWrapper.eq(Performance::getAuctionId, auctionId);
		 updateWrapper.set(Performance::getAuctionId, null);
		 performanceService.update(updateWrapper);
		 return Result.OK("移除成功！");
	 }
	/**
	 * 编辑
	 *
	 * @param auction
	 * @return
	 */
	@AutoLog(value = "拍卖会表-编辑")
	@ApiOperation(value="拍卖会表-编辑", notes="拍卖会表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody Auction auction) {
		auctionService.updateById(auction);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍卖会表-通过id删除")
	@ApiOperation(value="拍卖会表-通过id删除", notes="拍卖会表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		auctionService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "拍卖会表-批量删除")
	@ApiOperation(value="拍卖会表-批量删除", notes="拍卖会表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.auctionService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍卖会表-通过id查询")
	@ApiOperation(value="拍卖会表-通过id查询", notes="拍卖会表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		Auction auction = auctionService.getById(id);
		return Result.OK(auction);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param auction
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, Auction auction) {
      return super.exportXls(request, auction, Auction.class, "拍卖会表");
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
      return super.importExcel(request, response, Auction.class);
  }

}
