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

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.entity.CouponTicket;
import cn.winkt.modules.paimai.service.ICouponTicketService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.Coupon;
import cn.winkt.modules.paimai.service.ICouponService;
import java.util.Date;
import java.util.stream.Collectors;

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
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

 /**
 * @Description: 优惠券
 * @Author: jeecg-boot
 * @Date:   2023-05-20
 * @Version: V1.0
 */
@Slf4j
@Api(tags="优惠券")
@RestController
@RequestMapping("/coupons")
public class CouponController extends JeecgController<Coupon, ICouponService> {
	@Autowired
	private ICouponService couponService;

	@Resource
	private ICouponTicketService couponTicketService;

	@Resource
	private SystemApi systemApi;

	@Resource
	private AppApi appApi;
	/**
	 * 分页列表查询
	 *
	 * @param coupon
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "优惠券-分页列表查询")
	@ApiOperation(value="优惠券-分页列表查询", notes="优惠券-分页列表查询")
	@GetMapping(value = "/list")
	@AutoDict
	public Result<?> queryPageList(Coupon coupon,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<Coupon> queryWrapper = QueryGenerator.initQueryWrapper(coupon, req.getParameterMap());
		Page<Coupon> page = new Page<Coupon>(pageNo, pageSize);
		IPage<Coupon> pageList = couponService.page(page, queryWrapper);
		pageList.getRecords().forEach(cp -> {
			List<AppMemberVO> memberVOS = appApi.getMembersByIds(Arrays.asList(cp.getRuleMemberIds().split(",")));
			cp.setRuleMemberIds_dictText(memberVOS.stream().map(m -> {
				if(StringUtils.isNotEmpty(m.getRealname())) {
					return m.getRealname();
				}
				else if(StringUtils.isNotEmpty(m.getNickname())) {
					return m.getNickname();
				}
				else {
					return m.getId();
				}
			}).collect(Collectors.joining(",")));
		});
		return Result.OK(pageList);
	}

	@GetMapping("/dicts")
	public Result<?> queryDictItems(@RequestParam String dictCode) {
		return Result.OK(systemApi.getDictItems(dictCode));
	}
	
	/**
	 * 添加
	 *
	 * @param coupon
	 * @return
	 */
	@AutoLog(value = "优惠券-添加")
	@ApiOperation(value="优惠券-添加", notes="优惠券-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody Coupon coupon) {
		couponService.save(coupon);
		return Result.OK("添加成功！");
	}

	@DeleteMapping("/grant")
	public Result<?> grantTickets(@RequestParam String id) {
		couponService.grantTickets(id, AppContext.getApp());
		return Result.OK("发放成功");
	}
	/**
	 * 编辑
	 *
	 * @param coupon
	 * @return
	 */
	@AutoLog(value = "优惠券-编辑")
	@ApiOperation(value="优惠券-编辑", notes="优惠券-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody Coupon coupon) {
		couponService.updateById(coupon);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "优惠券-通过id删除")
	@ApiOperation(value="优惠券-通过id删除", notes="优惠券-通过id删除")
	@DeleteMapping(value = "/delete")
	@Transactional(rollbackFor = Exception.class)
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		//删除已经发放的优惠券
		LambdaQueryWrapper<CouponTicket> queryWrapper = new LambdaQueryWrapper<>();
		queryWrapper.eq(CouponTicket::getCouponId, id);
		couponService.removeById(id);
		couponTicketService.remove(queryWrapper);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "优惠券-通过id查询")
	@ApiOperation(value="优惠券-通过id查询", notes="优惠券-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		Coupon coupon = couponService.getById(id);
		return Result.OK(coupon);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param coupon
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, Coupon coupon) {
      return super.exportXls(request, coupon, Coupon.class, "优惠券");
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
      return super.importExcel(request, response, Coupon.class);
  }

}
