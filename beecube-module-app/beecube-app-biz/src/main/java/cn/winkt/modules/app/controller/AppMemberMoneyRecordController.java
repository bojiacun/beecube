package cn.winkt.modules.app.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.vo.WithdrawDTO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import cn.winkt.modules.app.service.IAppMemberMoneyRecordService;
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
 * @Description: 应用会员余额记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags="应用会员余额记录表")
@RestController
@RequestMapping("/app/money/records")
public class AppMemberMoneyRecordController extends JeecgController<AppMemberMoneyRecord, IAppMemberMoneyRecordService> {
	@Autowired
	private IAppMemberMoneyRecordService appMemberMoneyRecordService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appMemberMoneyRecord
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "应用会员余额记录表-分页列表查询")
	@ApiOperation(value="应用会员余额记录表-分页列表查询", notes="应用会员余额记录表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppMemberMoneyRecord appMemberMoneyRecord,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppMemberMoneyRecord> queryWrapper = QueryGenerator.initQueryWrapper(appMemberMoneyRecord, req.getParameterMap());
		queryWrapper.eq("status", 1);
		Page<AppMemberMoneyRecord> page = new Page<AppMemberMoneyRecord>(pageNo, pageSize);
		IPage<AppMemberMoneyRecord> pageList = appMemberMoneyRecordService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	 @AutoLog(value = "应用会员余额记录表-提现分页列表查询")
	 @ApiOperation(value="应用会员余额记录表-提现分页列表查询", notes="应用会员余额记录表-提现分页列表查询")
	 @GetMapping(value = "/withdraws")
	 public Result<?> queryWithDrawList(WithdrawDTO withdrawDTO,
										@RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
										@RequestParam(name="pageSize", defaultValue="10") Integer pageSize
									) {
		 QueryWrapper<AppMemberMoneyRecord> queryWrapper = new QueryWrapper<>();
		 queryWrapper.eq("mr.type", 4);
		 queryWrapper.orderByAsc("mr.status");
		 queryWrapper.orderByDesc("mr.create_time");
		 if(StringUtils.isNotEmpty(withdrawDTO.getMemberName())) {
			 queryWrapper.like("m.member_name", withdrawDTO.getMemberName());
		 }

		 Page<AppMemberMoneyRecord> page = new Page<>(pageNo, pageSize);
		 IPage<WithdrawDTO> pageList = appMemberMoneyRecordService.selectPageDTO(page, queryWrapper);
		 return Result.OK(pageList);
	 }
	/**
	 * 添加
	 *
	 * @param appMemberMoneyRecord
	 * @return
	 */
	@AutoLog(value = "应用会员余额记录表-添加")
	@ApiOperation(value="应用会员余额记录表-添加", notes="应用会员余额记录表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppMemberMoneyRecord appMemberMoneyRecord) {
		appMemberMoneyRecordService.save(appMemberMoneyRecord);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appMemberMoneyRecord
	 * @return
	 */
	@AutoLog(value = "应用会员余额记录表-编辑")
	@ApiOperation(value="应用会员余额记录表-编辑", notes="应用会员余额记录表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody AppMemberMoneyRecord appMemberMoneyRecord) {
		appMemberMoneyRecordService.updateById(appMemberMoneyRecord);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用会员余额记录表-通过id删除")
	@ApiOperation(value="应用会员余额记录表-通过id删除", notes="应用会员余额记录表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appMemberMoneyRecordService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "应用会员余额记录表-批量删除")
	@ApiOperation(value="应用会员余额记录表-批量删除", notes="应用会员余额记录表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appMemberMoneyRecordService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "应用会员余额记录表-通过id查询")
	@ApiOperation(value="应用会员余额记录表-通过id查询", notes="应用会员余额记录表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppMemberMoneyRecord appMemberMoneyRecord = appMemberMoneyRecordService.getById(id);
		return Result.OK(appMemberMoneyRecord);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appMemberMoneyRecord
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppMemberMoneyRecord appMemberMoneyRecord) {
      return super.exportXls(request, appMemberMoneyRecord, AppMemberMoneyRecord.class, "应用会员余额记录表");
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
      return super.importExcel(request, response, AppMemberMoneyRecord.class);
  }

}
