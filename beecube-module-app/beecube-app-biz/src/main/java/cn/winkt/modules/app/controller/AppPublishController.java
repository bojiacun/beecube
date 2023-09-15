package cn.winkt.modules.app.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.service.IAppService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.open.api.WxOpenComponentService;
import me.chanjar.weixin.open.api.WxOpenMaService;
import me.chanjar.weixin.open.api.WxOpenService;
import me.chanjar.weixin.open.api.impl.WxOpenMaServiceImpl;
import me.chanjar.weixin.open.bean.WxOpenMaCodeTemplate;
import me.chanjar.weixin.open.bean.result.WxOpenMaQueryAuditResult;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.util.oConvertUtils;
import cn.winkt.modules.app.entity.AppPublish;
import cn.winkt.modules.app.service.IAppPublishService;

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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description: 应用前端发布版本表
 * @Author: jeecg-boot
 * @Date: 2023-04-02
 * @Version: V1.0
 */
@Slf4j
@Api(tags = "应用前端发布版本表")
@RestController
@RequestMapping("/publishes")
public class AppPublishController extends JeecgController<AppPublish, IAppPublishService> {
    @Autowired
    private IAppPublishService appPublishService;

    @Resource
    private WxOpenService wxOpenService;

    @Resource
    private IAppService appService;

    /**
     * 分页列表查询
     *
     * @param appPublish
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @AutoLog(value = "应用前端发布版本表-分页列表查询")
    @ApiOperation(value = "应用前端发布版本表-分页列表查询", notes = "应用前端发布版本表-分页列表查询")
    @GetMapping(value = "/list")
    public Result<?> queryPageList(AppPublish appPublish,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<AppPublish> queryWrapper = QueryGenerator.initQueryWrapper(appPublish, req.getParameterMap());
        Page<AppPublish> page = new Page<AppPublish>(pageNo, pageSize);
        IPage<AppPublish> pageList = appPublishService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    /**
     * 添加
     *
     * @param appPublish
     * @return
     */
    @AutoLog(value = "应用前端发布版本表-添加")
    @ApiOperation(value = "应用前端发布版本表-添加", notes = "应用前端发布版本表-添加")
    @PostMapping(value = "/add")
    public Result<?> add(@RequestBody AppPublish appPublish) {
        appPublishService.save(appPublish);
        return Result.OK("添加成功！");
    }

    /**
     * 编辑
     *
     * @param appPublish
     * @return
     */
    @AutoLog(value = "应用前端发布版本表-编辑")
    @ApiOperation(value = "应用前端发布版本表-编辑", notes = "应用前端发布版本表-编辑")
    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result<?> edit(@RequestBody AppPublish appPublish) {
        appPublishService.updateById(appPublish);
        return Result.OK("编辑成功!");
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "应用前端发布版本表-通过id删除")
    @ApiOperation(value = "应用前端发布版本表-通过id删除", notes = "应用前端发布版本表-通过id删除")
    @DeleteMapping(value = "/delete")
    public Result<?> delete(@RequestParam(name = "id", required = true) String id) {
        appPublishService.removeById(id);
        return Result.OK("删除成功!");
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @AutoLog(value = "应用前端发布版本表-批量删除")
    @ApiOperation(value = "应用前端发布版本表-批量删除", notes = "应用前端发布版本表-批量删除")
    @DeleteMapping(value = "/deleteBatch")
    public Result<?> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        this.appPublishService.removeByIds(Arrays.asList(ids.split(",")));
        return Result.OK("批量删除成功！");
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @AutoLog(value = "应用前端发布版本表-通过id查询")
    @ApiOperation(value = "应用前端发布版本表-通过id查询", notes = "应用前端发布版本表-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<?> queryById(@RequestParam(name = "id", required = true) String id) {
        AppPublish appPublish = appPublishService.getById(id);
        return Result.OK(appPublish);
    }


    @AutoLog(value = "应用前端发布版本表-获取最后一次发布")
    @ApiOperation(value = "应用前端发布版本表-获取最后一次发布", notes = "应用前端发布版本表-获取最后一次发布")
    @GetMapping(value = "/latest")
    public Result<?> queryLatest() throws WxErrorException {
        App app = appService.getById(AppContext.getApp());
        if(app == null) {
            throw new JeecgBootException("找不到APP");
        }
        if(!app.getAuthStatus().equals("authorized") || StringUtils.isEmpty(app.getAuthorizerRefreshToken())) {
            throw new JeecgBootException("无法获取刷新令牌");
        }
        //查询体验版是否审核通过,如果通过则更新
        AppPublish publish = appPublishService.getLatestPublish();

        wxOpenService.getWxOpenConfigStorage().setAuthorizerRefreshToken(app.getAuthorizerAppid(), app.getAuthorizerRefreshToken());

        String appAccessToken = wxOpenService.getWxOpenComponentService().getAuthorizerAccessToken(app.getAuthorizerAppid(), false);
        WxMaDefaultConfigImpl wxMaDefaultConfig = new WxMaDefaultConfigImpl();
        wxMaDefaultConfig.setAppid(app.getAuthorizerAppid());
        wxMaDefaultConfig.setAccessToken(appAccessToken);
        WxOpenMaService wxOpenMaService = new WxOpenMaServiceImpl(wxOpenService.getWxOpenComponentService(), app.getAuthorizerAppid(), wxMaDefaultConfig);

        if(publish.getStatus() == 1) {
            WxOpenMaQueryAuditResult result = wxOpenMaService.getAuditStatus(publish.getAuditId());
            if (result.getStatus() == 1) {
                publish.setReason(result.getReason());
                publish.setStatus(3);
            } else if (result.getStatus() == 0) {
                publish.setStatus(2);
            }
            log.info("微信返回的审核状态为 {}", JSONObject.toJSONString(result));
            appPublishService.updateById(publish);
        }

        return Result.OK(publish);
    }

    @AutoLog(value = "应用前端发布版本表-最新版本")
    @ApiOperation(value = "应用前端发布版本表-最新版本", notes = "应用前端发布版本表-最新版本")
    @GetMapping(value = "/new")
    public Result<?> queryNew() throws WxErrorException {
        WxOpenComponentService wxOpenComponentService = wxOpenService.getWxOpenComponentService();
        List<WxOpenMaCodeTemplate> templates = wxOpenComponentService.getTemplateList(0);
        return Result.OK(templates.get(0));
    }
    /**
     * 导出excel
     *
     * @param request
     * @param appPublish
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, AppPublish appPublish) {
        return super.exportXls(request, appPublish, AppPublish.class, "应用前端发布版本表");
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
        return super.importExcel(request, response, AppPublish.class);
    }

}
