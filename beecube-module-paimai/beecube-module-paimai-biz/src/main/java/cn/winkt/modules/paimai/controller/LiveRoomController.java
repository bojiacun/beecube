package cn.winkt.modules.paimai.controller;

import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.AppTencentConfigItemVO;
import cn.winkt.modules.paimai.entity.LiveRoomStream;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.ILiveRoomStreamService;
import cn.winkt.modules.paimai.service.IPerformanceService;
import cn.winkt.modules.paimai.util.TencentLiveTool;
import cn.winkt.modules.paimai.vo.AppConfigItemVO;
import cn.winkt.modules.paimai.vo.AppTencentConfigVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.collections.map.CompositeMap;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.paimai.entity.LiveRoom;
import cn.winkt.modules.paimai.service.ILiveRoomService;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

 /**
 * @Description: 直播间表
 * @Author: jeecg-boot
 * @Date:   2023-04-04
 * @Version: V1.0
 */
@Slf4j
@Api(tags="直播间表")
@RestController
@RequestMapping("/rooms")
public class LiveRoomController extends JeecgController<LiveRoom, ILiveRoomService> {
	@Autowired
	private ILiveRoomService liveRoomService;

	@Resource
	private AppApi appApi;

	@Resource
	private IPerformanceService performanceService;

	@Resource
	private ILiveRoomStreamService liveRoomStreamService;
	
	/**
	 * 分页列表查询
	 *
	 * @param liveRoom
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "直播间表-分页列表查询")
	@ApiOperation(value="直播间表-分页列表查询", notes="直播间表-分页列表查询")
	@GetMapping(value = "/list")
	@AutoDict
	public Result<?> queryPageList(LiveRoom liveRoom,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<LiveRoom> queryWrapper = QueryGenerator.initQueryWrapper(liveRoom, req.getParameterMap());
		Page<LiveRoom> page = new Page<LiveRoom>(pageNo, pageSize);
		IPage<LiveRoom> pageList = liveRoomService.page(page, queryWrapper);
		pageList.getRecords().forEach(room -> {
			LambdaQueryWrapper<LiveRoomStream> streamLambdaQueryWrapper = new LambdaQueryWrapper<>();
			streamLambdaQueryWrapper.eq(LiveRoomStream::getLiveId, room.getId());
			room.setStreams(liveRoomStreamService.list(streamLambdaQueryWrapper));
		});
		return Result.OK(pageList);
	}
	
	/**
	 * 添加
	 *
	 * @param liveRoom
	 * @return
	 */
	@AutoLog(value = "直播间表-添加")
	@ApiOperation(value="直播间表-添加", notes="直播间表-添加")
	@PostMapping(value = "/add")
	@Transactional(rollbackFor = Exception.class)
	public Result<?> add(@RequestBody LiveRoom liveRoom) throws InvocationTargetException, IllegalAccessException {
		if(StringUtils.isNotEmpty(liveRoom.getMainAnchor())) {
			AppMemberVO appMemberVO = appApi.getMemberById(liveRoom.getMainAnchor());
			if(appMemberVO == null) {
				throw new JeecgBootException("找不到用户");
			}
			liveRoom.setMainAnchorName(StringUtils.getIfEmpty(appMemberVO.getNickname(),appMemberVO::getRealname));
			liveRoom.setMainAnchorAvatar(appMemberVO.getAvatar());
		}
		if(StringUtils.isNotEmpty(liveRoom.getSubAnchor())) {
			AppMemberVO appMemberVO = appApi.getMemberById(liveRoom.getSubAnchor());
			if(appMemberVO == null) {
				throw new JeecgBootException("找不到用户");
			}
			liveRoom.setSubAnchorName(StringUtils.getIfEmpty(appMemberVO.getNickname(),appMemberVO::getRealname));
			liveRoom.setSubAnchorAvatar(appMemberVO.getAvatar());
		}
		if(StringUtils.isNotEmpty(liveRoom.getPerformanceId())) {
			Performance performance = performanceService.getById(liveRoom.getPerformanceId());
			if(performance == null) {
				throw new JeecgBootException("找不到专场");
			}
			liveRoom.setPerformanceName(performance.getTitle());
		}
        liveRoomService.save(liveRoom);
        List<AppTencentConfigItemVO> configItemVOS = appApi.tencentConfigs();
        Map<String, String> configMap = new HashMap<>();
        configItemVOS.forEach(item -> {
            configMap.put(item.getSettingKey(), item.getSettingValue());
        });
        AppTencentConfigVO appTencentConfigVO = new AppTencentConfigVO();
        BeanUtils.copyProperties(appTencentConfigVO, configMap);
        long endTime = liveRoom.getEndTime().getTime() / 1000;

		Arrays.asList(1,2).forEach(n -> {
			LiveRoomStream stream = new LiveRoomStream();
			stream.setLiveId(liveRoom.getId());
			liveRoomStreamService.save(stream);
			//计算腾讯云直播推流以及拉流地址
			String pushAddress = String.format("%s://%s/%s/%s?%s",
					appTencentConfigVO.getPushSchema(),
					appTencentConfigVO.getPushDomain(),
					appTencentConfigVO.getAppName(),
					stream.getId(),
					TencentLiveTool.getSafeUrl(appTencentConfigVO.getPushTxtSecret(), stream.getId(), endTime)
			);
			String playAddress = StringUtils.EMPTY;
			switch (appTencentConfigVO.getPlaySchema().toLowerCase()) {
				case "rtmp":
					playAddress = String.format("rtmp://%s/%s/%s?%s",
							appTencentConfigVO.getPlayDomain(),
							appTencentConfigVO.getAppName(),
							stream.getId(),
							TencentLiveTool.getSafeUrl(appTencentConfigVO.getPlayTxtSecret(), stream.getId(), endTime)
					);
					break;
				case "flv":
					playAddress = String.format("http://%s/%s/%s.flv?%s",
							appTencentConfigVO.getPlayDomain(),
							appTencentConfigVO.getAppName(),
							stream.getId(),
							TencentLiveTool.getSafeUrl(appTencentConfigVO.getPlayTxtSecret(), stream.getId(), endTime)
					);
					break;
				case "hls":
					playAddress = String.format("http://%s/%s/%s.m3u8?%s",
							appTencentConfigVO.getPlayDomain(),
							appTencentConfigVO.getAppName(),
							stream.getId(),
							TencentLiveTool.getSafeUrl(appTencentConfigVO.getPlayTxtSecret(), stream.getId(), endTime)
					);
					break;
				case "webrtc":
					playAddress = String.format("webrtc://%s/%s/%s?%s",
							appTencentConfigVO.getPlayDomain(),
							appTencentConfigVO.getAppName(),
							stream.getId(),
							TencentLiveTool.getSafeUrl(appTencentConfigVO.getPlayTxtSecret(), stream.getId(), endTime)
					);
					break;
			}

			stream.setPushAddress(pushAddress);
			stream.setPlayAddress(playAddress);
			liveRoomStreamService.updateById(stream);
		});

		return Result.OK("添加成功！");
	}
	
	/**
	 * 编辑
	 *
	 * @param liveRoom
	 * @return
	 */
	@AutoLog(value = "直播间表-编辑")
	@ApiOperation(value="直播间表-编辑", notes="直播间表-编辑")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<?> edit(@RequestBody LiveRoom liveRoom) {
		if(StringUtils.isNotEmpty(liveRoom.getMainAnchor())) {
			AppMemberVO appMemberVO = appApi.getMemberById(liveRoom.getMainAnchor());
			if(appMemberVO == null) {
				throw new JeecgBootException("找不到用户");
			}
			liveRoom.setMainAnchorName(StringUtils.getIfEmpty(appMemberVO.getNickname(),appMemberVO::getRealname));
			liveRoom.setMainAnchorAvatar(appMemberVO.getAvatar());
		}
		if(StringUtils.isNotEmpty(liveRoom.getSubAnchor())) {
			AppMemberVO appMemberVO = appApi.getMemberById(liveRoom.getSubAnchor());
			if(appMemberVO == null) {
				throw new JeecgBootException("找不到用户");
			}
			liveRoom.setSubAnchorName(StringUtils.getIfEmpty(appMemberVO.getNickname(),appMemberVO::getRealname));
			liveRoom.setSubAnchorAvatar(appMemberVO.getAvatar());
		}
		if(StringUtils.isNotEmpty(liveRoom.getPerformanceId())) {
			Performance performance = performanceService.getById(liveRoom.getPerformanceId());
			if(performance == null) {
				throw new JeecgBootException("找不到专场");
			}
			liveRoom.setPerformanceName(performance.getTitle());
		}
		liveRoomService.updateById(liveRoom);
		return Result.OK("编辑成功!");
	}
	
	/**
	 * 通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "直播间表-通过id删除")
	@ApiOperation(value="直播间表-通过id删除", notes="直播间表-通过id删除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		liveRoomService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 * 批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "直播间表-批量删除")
	@ApiOperation(value="直播间表-批量删除", notes="直播间表-批量删除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.liveRoomService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功！");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "直播间表-通过id查询")
	@ApiOperation(value="直播间表-通过id查询", notes="直播间表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		LiveRoom liveRoom = liveRoomService.getById(id);
		return Result.OK(liveRoom);
	}

  /**
   * 导出excel
   *
   * @param request
   * @param liveRoom
   */
  @RequestMapping(value = "/exportXls")
  public ModelAndView exportXls(HttpServletRequest request, LiveRoom liveRoom) {
      return super.exportXls(request, liveRoom, LiveRoom.class, "直播间表");
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
      return super.importExcel(request, response, LiveRoom.class);
  }

}
