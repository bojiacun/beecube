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
import cn.winkt.modules.paimai.entity.MessagePool;
import cn.winkt.modules.paimai.service.IMessagePoolService;
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
 * @Description: 拍卖消息队列表
 * @Author: jeecg-boot
 * @Date:   2023-03-08
 * @Version: V1.0
 */
@Slf4j
@Api(tags="拍卖消息队列表")
@RestController
@RequestMapping("/messagePool")
public class MessagePoolController extends JeecgController<MessagePool, IMessagePoolService> {
	@Autowired
	private IMessagePoolService messagePoolService;
	
	/**
	 * 分页列表查询
	 *
	 * @param messagePool
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "拍卖消息队列表-分页列表查询")
	@ApiOperation(value="拍卖消息队列表-分页列表查询", notes="拍卖消息队列表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(MessagePool messagePool,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<MessagePool> queryWrapper = QueryGenerator.initQueryWrapper(messagePool, req.getParameterMap());
		Page<MessagePool> page = new Page<MessagePool>(pageNo, pageSize);
		IPage<MessagePool> pageList = messagePoolService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param messagePool
	 * @return
	 */
	@AutoLog(value = "拍卖消息队列表-添加")
	@ApiOperation(value="拍卖消息队列表-添加", notes="拍卖消息队列表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody MessagePool messagePool) {
		messagePoolService.save(messagePool);
		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param messagePool
	 * @return
	 */
	@AutoLog(value = "拍卖消息队列表-编辑")
	@ApiOperation(value="拍卖消息队列表-编辑", notes="拍卖消息队列表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody MessagePool messagePool) {
		messagePoolService.updateById(messagePool);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍卖消息队列表-通过id删除")
	@ApiOperation(value="拍卖消息队列表-通过id删除", notes="拍卖消息队列表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		messagePoolService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "拍卖消息队列表-批量删除")
	@ApiOperation(value="拍卖消息队列表-批量删除", notes="拍卖消息队列表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.messagePoolService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "拍卖消息队列表-通过id查询")
	@ApiOperation(value="拍卖消息队列表-通过id查询", notes="拍卖消息队列表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		MessagePool messagePool = messagePoolService.getById(id);
		return Result.OK(messagePool);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param messagePool
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, MessagePool messagePool) {
      return super.exportXls(request, messagePool, MessagePool.class, "拍卖消息队列表");
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
      return super.importExcel(request, response, MessagePool.class);
  }

}
