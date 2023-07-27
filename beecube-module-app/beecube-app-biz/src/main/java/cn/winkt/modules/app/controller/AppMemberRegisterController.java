package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppSettingService;
import cn.winkt.modules.app.vo.MemberSetting;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.DateUtils;
import org.jeecg.config.AppContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Arrays;

/**
* @Description: 应用会员表
* @Author: jeecg-boot
* @Date:   2023-02-08
* @Version: V1.0
*/
@Slf4j
@Api(tags="体验注册")
@RestController
@RequestMapping("/member/register")
public class AppMemberRegisterController extends JeecgController<AppMember, IAppMemberService> {
   @Autowired
   private IAppMemberService appMemberService;

   @Resource
   private IAppSettingService appSettingService;

   /**
    * 分页列表查询
    *
    * @param appMember
    * @param pageNo
    * @param pageSize
    * @param req
    * @return
    */
   @AutoLog(value = "应用会员表-分页列表查询")
   @ApiOperation(value="应用会员表-分页列表查询", notes="应用会员表-分页列表查询")
   @GetMapping(value = "/list")
   @AutoDict
   public Result<?> queryPageList(AppMember appMember,
                                  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
                                  HttpServletRequest req) {
       QueryWrapper<AppMember> queryWrapper = QueryGenerator.initQueryWrapper(appMember, req.getParameterMap());
       String keywords = req.getParameter("keywords");
       String isAgent = req.getParameter("isAgent");
       if(StringUtils.isNotEmpty(isAgent)) {
           queryWrapper.eq("is_agent", 1);
       }
       String authStatus = req.getParameter("authStatus");
       if(StringUtils.isNotEmpty(authStatus)) {
           queryWrapper.eq("auth_status", 1);
       }
       String startDate = req.getParameter("startDate");
       String endDate = req.getParameter("endDate");
       if(StringUtils.isNotEmpty(startDate)) {
           queryWrapper.ge("create_time", DateUtils.str2Date(startDate, new SimpleDateFormat("yyyy-MM-dd")));
       }
       if(StringUtils.isNotEmpty(endDate)) {
           queryWrapper.le("create_time", DateUtils.str2Date(endDate, new SimpleDateFormat("yyyy-MM-dd")));
       }
       if(StringUtils.isNotEmpty(keywords)) {
           queryWrapper.and(qw -> {
               qw.eq("id", keywords).or()
                       .like("nickname", keywords).or()
                       .like("realname", keywords).or()
                       .like("phone", keywords);
           });
       }
       Page<AppMember> page = new Page<AppMember>(pageNo, pageSize);
       IPage<AppMember> pageList = appMemberService.page(page, queryWrapper);
       return Result.OK(pageList);
   }

   /**
    * 添加
    *
    * @param appMember
    * @return
    */
   @AutoLog(value = "应用会员表-添加")
   @ApiOperation(value="应用会员表-添加", notes="应用会员表-添加")
   @PostMapping(value = "/add")
   public Result<?> add(@RequestBody AppMember appMember) {
       appMemberService.save(appMember);
       return Result.OK("添加成功！");
   }

   /**
    * 编辑
    *
    * @param appMember
    * @return
    */
   @AutoLog(value = "应用会员表-编辑")
   @ApiOperation(value="应用会员表-编辑", notes="应用会员表-编辑")
   @RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
   public Result<?> edit(@RequestBody AppMember appMember) throws InvocationTargetException, IllegalAccessException {
       AppMember old = appMemberService.getById(appMember.getId());
       //判断是不是通过实名认证
       if(old.getAuthStatus() != 2 && appMember.getAuthStatus() == 2) {
           //实名认证赠送积分
           MemberSetting memberSetting = appSettingService.queryMemberSettings(AppContext.getApp());
           if(memberSetting != null && StringUtils.isNotEmpty(memberSetting.getAuthRealIntegral())) {
               appMemberService.inScore(appMember.getId(), new BigDecimal(memberSetting.getAuthRealIntegral()), "实名认证送积分");
           }
       }
       appMemberService.updateById(appMember);
       return Result.OK("编辑成功!");
   }

   /**
    * 通过id删除
    *
    * @param id
    * @return
    */
   @AutoLog(value = "应用会员表-通过id删除")
   @ApiOperation(value="应用会员表-通过id删除", notes="应用会员表-通过id删除")
   @DeleteMapping(value = "/delete")
   public Result<?> delete(@RequestParam(name="id",required=true) String id) {
       appMemberService.removeById(id);
       return Result.OK("删除成功!");
   }

   /**
    * 批量删除
    *
    * @param ids
    * @return
    */
   @AutoLog(value = "应用会员表-批量删除")
   @ApiOperation(value="应用会员表-批量删除", notes="应用会员表-批量删除")
   @DeleteMapping(value = "/deleteBatch")
   public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
       this.appMemberService.removeByIds(Arrays.asList(ids.split(",")));
       return Result.OK("批量删除成功！");
   }

   /**
    * 通过id查询
    *
    * @param id
    * @return
    */
   @AutoLog(value = "应用会员表-通过id查询")
   @ApiOperation(value="应用会员表-通过id查询", notes="应用会员表-通过id查询")
   @GetMapping(value = "/queryById")
   public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
       AppMember appMember = appMemberService.getById(id);
       return Result.OK(appMember);
   }
}
