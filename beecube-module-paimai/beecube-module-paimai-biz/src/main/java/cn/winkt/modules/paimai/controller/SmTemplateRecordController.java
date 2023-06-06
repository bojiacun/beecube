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
import cn.winkt.modules.paimai.entity.SmTemplateRecord;
import cn.winkt.modules.paimai.service.ISmTemplateRecordService;
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
 * @Description: 营销短信发送记录
 * @Author: jeecg-boot
 * @Date:   2023-06-06
 * @Version: V1.0
 */
@Slf4j
@Api(tags="营销短信发送记录")
@RestController
@RequestMapping("/smts/records")
public class SmTemplateRecordController extends JeecgController<SmTemplateRecord, ISmTemplateRecordService> {
	@Autowired
	private ISmTemplateRecordService smTemplateRecordService;
	
	/**
	 * 分页列表查询
	 *
	 * @param smTemplateRecord
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "营销短信发送记录-分页列表查询")
	@ApiOperation(value="营销短信发送记录-分页列表查询", notes="营销短信发送记录-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(SmTemplateRecord smTemplateRecord,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<SmTemplateRecord> queryWrapper = QueryGenerator.initQueryWrapper(smTemplateRecord, req.getParameterMap());
		Page<SmTemplateRecord> page = new Page<SmTemplateRecord>(pageNo, pageSize);
		IPage<SmTemplateRecord> pageList = smTemplateRecordService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param smTemplateRecord
	 * @return
	 */
	@AutoLog(value = "营销短信发送记录-添加")
	@ApiOperation(value="营销短信发送记录-添加", notes="营销短信发送记录-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody SmTemplateRecord smTemplateRecord) {
		smTemplateRecordService.save(smTemplateRecord);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param smTemplateRecord
	 * @return
	 */
	@AutoLog(value = "营销短信发送记录-编辑")
	@ApiOperation(value="营销短信发送记录-编辑", notes="营销短信发送记录-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody SmTemplateRecord smTemplateRecord) {
		smTemplateRecordService.updateById(smTemplateRecord);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "营销短信发送记录-通过id删除")
	@ApiOperation(value="营销短信发送记录-通过id删除", notes="营销短信发送记录-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		smTemplateRecordService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "营销短信发送记录-批量删除")
	@ApiOperation(value="营销短信发送记录-批量删除", notes="营销短信发送记录-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.smTemplateRecordService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "营销短信发送记录-通过id查询")
	@ApiOperation(value="营销短信发送记录-通过id查询", notes="营销短信发送记录-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		SmTemplateRecord smTemplateRecord = smTemplateRecordService.getById(id);
		return Result.OK(smTemplateRecord);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param smTemplateRecord
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, SmTemplateRecord smTemplateRecord) {
      return super.exportXls(request, smTemplateRecord, SmTemplateRecord.class, "营销短信发送记录");
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
      return super.importExcel(request, response, SmTemplateRecord.class);
  }

}
