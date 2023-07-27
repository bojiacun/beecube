package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.config.TencentSmsService;
import cn.winkt.modules.app.config.TencentSmsServices;
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
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.DateUtils;
import org.jeecg.common.util.RedisUtil;
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
import java.util.Map;

/**
* @Description: 应用会员表
* @Author: jeecg-boot
* @Date:   2023-02-08
* @Version: V1.0
*/
@Slf4j
@Api(tags="体验注册")
@RestController
@RequestMapping("/register")
public class AppMemberRegisterController extends JeecgController<AppMemberRegister, IAppMemberRegisterService> {
   @Autowired
   private IAppMemberRegisterService appMemberRegisterService;
    @Resource
    TencentSmsServices tencentSmsServices;

    @Resource
    RedisUtil redisUtil;
    @PostMapping("/send")
    public Result<Boolean> sendCode(@RequestBody Map<String, String> postData) {
        TencentSmsService service = tencentSmsServices.getDefaultService();
        if(service == null) {
            throw new JeecgBootException("获取短信服务失败");
        }
        String mobile = postData.get("mobile");
        String vcode = RandomStringUtils.randomNumeric(6);
        service.sendCode(mobile, vcode);
        redisUtil.set("MOBILE_CODE:"+mobile, vcode);
        redisUtil.expire("MOBILE_CODE:"+mobile, 300);
        log.debug("发送验证码为 {} {}", mobile, vcode);
        return Result.OK(true);
    }

    @PutMapping("/check")
    public Result<Boolean> checkCode(@RequestBody Map<String, String> postData) {
        String mobile = postData.get("mobile");
        String code = postData.get("code");
        String vcode = (String)redisUtil.get("MOBILE_CODE:"+mobile);
        if(StringUtils.isNotEmpty(vcode) && vcode.equals(code)) {
            redisUtil.del("MOBILE_CODE:"+mobile);
            return Result.OK(true);
        }
        return Result.OK(false);
    }
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
