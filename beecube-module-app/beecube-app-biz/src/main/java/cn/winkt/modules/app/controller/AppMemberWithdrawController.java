package cn.winkt.modules.app.controller;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import cn.winkt.modules.app.entity.AppMemberScoreRecord;
import cn.winkt.modules.app.service.*;
import cn.winkt.modules.app.vo.MemberSetting;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.app.entity.AppMemberWithdraw;

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
 * @Description: 用户提现申请表
 * @Author: jeecg-boot
 * @Date:   2023-03-14
 * @Version: V1.0
 */
@Slf4j
@Api(tags="用户提现申请表")
@RestController
@RequestMapping("/withdraws")
public class AppMemberWithdrawController extends JeecgController<AppMemberWithdraw, IAppMemberWithdrawService> {
	@Autowired
	private IAppMemberWithdrawService appMemberWithdrawService;

	@Resource
	private IAppMemberService appMemberService;

	@Resource
	private IAppMemberMoneyRecordService appMemberMoneyRecordService;

	@Resource
	private IAppMemberScoreRecordService appMemberScoreRecordService;

	@Resource
	private IAppSettingService appSettingService;
	
	/**
	 * 分页列表查询
	 *
	 * @param appMemberWithdraw
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "用户提现申请表-分页列表查询")
	@ApiOperation(value="用户提现申请表-分页列表查询", notes="用户提现申请表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(AppMemberWithdraw appMemberWithdraw,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<AppMemberWithdraw> queryWrapper = QueryGenerator.initQueryWrapper(appMemberWithdraw, req.getParameterMap());
		Page<AppMemberWithdraw> page = new Page<AppMemberWithdraw>(pageNo, pageSize);
		IPage<AppMemberWithdraw> pageList = appMemberWithdrawService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param appMemberWithdraw
	 * @return
	 */
	@AutoLog(value = "用户提现申请表-添加")
	@ApiOperation(value="用户提现申请表-添加", notes="用户提现申请表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody AppMemberWithdraw appMemberWithdraw) {
		appMemberWithdrawService.save(appMemberWithdraw);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param appMemberWithdraw
	 * @return
	 */
	@AutoLog(value = "用户提现申请表-编辑")
	@ApiOperation(value="用户提现申请表-编辑", notes="用户提现申请表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	@Transactional(rollbackFor = Exception.class)
	public Result<?> edit(@RequestBody AppMemberWithdraw appMemberWithdraw) throws InvocationTargetException, IllegalAccessException {
		LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();

		if(appMemberWithdraw.getStatus() == 1) {
			AppMember member = appMemberService.getById(appMemberWithdraw.getMemberId());
			MemberSetting memberSetting = appSettingService.queryMemberSettings(AppContext.getApp());

			//处理了
			appMemberWithdraw.setResolver(loginUser.getUsername());
			appMemberWithdraw.setResolveTime(new Date());

			if(appMemberWithdraw.getType() == 1) {
				if(member.getMoney().compareTo(appMemberWithdraw.getAmount()) < 0) {
					throw new JeecgBootException("余额不足");
				}
				//这里还得给用户减去余额
				AppMemberMoneyRecord record = new AppMemberMoneyRecord();
				record.setType(4);
				record.setStatus(1);
				record.setMoney(appMemberWithdraw.getAmount().doubleValue());
				record.setMemberId(appMemberWithdraw.getMemberId());
				record.setDescription("用户提现");
				member.setMoney(member.getMoney().subtract(appMemberWithdraw.getAmount()).setScale(2, RoundingMode.CEILING));
				appMemberService.updateById(member);
				appMemberMoneyRecordService.save(record);
			}
			else if(appMemberWithdraw.getType() == 2) {
				String ratio = memberSetting.getIntegralToMoney();
				BigDecimal subScore = appMemberWithdraw.getAmount().multiply(new BigDecimal(ratio.split(":")[0])).setScale(2, RoundingMode.CEILING);
				if(member.getScore().compareTo(subScore) < 0) {
					throw new JeecgBootException("积分不足");
				}
				AppMemberScoreRecord record = new AppMemberScoreRecord();
				record.setType(1);
				record.setDescription("用户提现");
				record.setScore(appMemberWithdraw.getAmount());
				record.setMemberId(appMemberWithdraw.getMemberId());
				member.setScore(member.getScore().subtract(subScore));
				appMemberService.updateById(member);
				appMemberScoreRecordService.save(record);
			}
		}
		appMemberWithdrawService.updateById(appMemberWithdraw);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "用户提现申请表-通过id删除")
	@ApiOperation(value="用户提现申请表-通过id删除", notes="用户提现申请表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		appMemberWithdrawService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "用户提现申请表-批量删除")
	@ApiOperation(value="用户提现申请表-批量删除", notes="用户提现申请表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.appMemberWithdrawService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "用户提现申请表-通过id查询")
	@ApiOperation(value="用户提现申请表-通过id查询", notes="用户提现申请表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		AppMemberWithdraw appMemberWithdraw = appMemberWithdrawService.getById(id);
		return Result.OK(appMemberWithdraw);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param appMemberWithdraw
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, AppMemberWithdraw appMemberWithdraw) {
      return super.exportXls(request, appMemberWithdraw, AppMemberWithdraw.class, "用户提现申请表");
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
      return super.importExcel(request, response, AppMemberWithdraw.class);
  }

}
