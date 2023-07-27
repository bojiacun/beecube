package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.entity.AppMemberRegister;
import cn.winkt.modules.app.service.IAppMemberRegisterService;
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
public class AppMemberRegisterController extends JeecgController<AppMemberRegister, IAppMemberRegisterService> {
   @Autowired
   private IAppMemberRegisterService appMemberRegisterService;

   @Resource
   private IAppSettingService appSettingService;

   /**
    * 分页列表查询
    *
    * @param AppMemberRegister
    * @param pageNo
    * @param pageSize
    * @param req
    * @return
    */
   @AutoLog(value = "应用会员表-分页列表查询")
   @ApiOperation(value="应用会员表-分页列表查询", notes="应用会员表-分页列表查询")
   @GetMapping(value = "/list")
   @AutoDict
   public Result<?> queryPageList(AppMemberRegister AppMemberRegister,
                                  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
                                  HttpServletRequest req) {
       QueryWrapper<AppMemberRegister> queryWrapper = QueryGenerator.initQueryWrapper(AppMemberRegister, req.getParameterMap());
       Page<AppMemberRegister> page = new Page<AppMemberRegister>(pageNo, pageSize);
       IPage<AppMemberRegister> pageList = appMemberRegisterService.page(page, queryWrapper);
       return Result.OK(pageList);
   }

   /**
    * 添加
    *
    * @param AppMemberRegister
    * @return
    */
   @AutoLog(value = "应用会员表-添加")
   @ApiOperation(value="应用会员表-添加", notes="应用会员表-添加")
   @PostMapping(value = "/add")
   public Result<?> add(@RequestBody AppMemberRegister AppMemberRegister) {
       appMemberRegisterService.save(AppMemberRegister);
       return Result.OK("添加成功！");
   }

   /**
    * 编辑
    *
    * @param AppMemberRegister
    * @return
    */
   @AutoLog(value = "应用会员表-编辑")
   @ApiOperation(value="应用会员表-编辑", notes="应用会员表-编辑")
   @RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
   public Result<?> edit(@RequestBody AppMemberRegister AppMemberRegister) throws InvocationTargetException, IllegalAccessException {
       AppMemberRegister old = appMemberRegisterService.getById(AppMemberRegister.getId());
       appMemberRegisterService.updateById(AppMemberRegister);
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
       appMemberRegisterService.removeById(id);
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
       this.appMemberRegisterService.removeByIds(Arrays.asList(ids.split(",")));
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
       AppMemberRegister AppMemberRegister = appMemberRegisterService.getById(id);
       return Result.OK(AppMemberRegister);
   }
}
