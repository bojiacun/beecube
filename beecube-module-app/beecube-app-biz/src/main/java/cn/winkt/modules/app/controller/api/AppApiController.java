package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.*;
import cn.winkt.modules.app.service.*;
import cn.winkt.modules.app.utils.AppTokenUtils;
import cn.winkt.modules.app.vo.AppVO;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.dto.DataLogDTO;
import org.jeecg.common.api.dto.OnlineAuthDTO;
import org.jeecg.common.api.dto.message.*;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.system.vo.*;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.common.util.SqlInjectionUtil;
import org.jeecg.config.AppContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AppApiController {

    @Resource
    IAppService appService;
    
    @Resource
    AppMemberProvider appMemberProvider;

    @Resource
    IAppMemberService appMemberService;

    @Resource
    IAppSettingService appSettingService;

    @Resource
    IAppMemberMoneyRecordService appMemberMoneyRecordService;

    @Resource
    SystemApi systemApi;

    @Resource
    RedisUtil redisUtil;

    @Resource
    IAppTencentConfigService tencentConfigService;


    @PutMapping("/token/verify")
    public Boolean appVerifyToken(@RequestParam String appId, @RequestParam String userId, @RequestParam String token) {
        AppContext.setApp(appId);
        Boolean result = true;
        try {
            AppTokenUtils.verifyToken(token, appMemberProvider, redisUtil);
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return result;
    }

    @GetMapping("/all")
    public List<App> allList() {
        LambdaQueryWrapper<App> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(App::getStatus, 1);
        queryWrapper.gt(App::getEndTime, new Date());
        return appService.list(queryWrapper);
    }

    @GetMapping("/getMemberById")
    public AppMember queryAppMember(@RequestParam("id") String id) {
        return appMemberService.getById(id);
    }

    @GetMapping("/getAppById")
    public App getAppById(@RequestParam String id) {
        return appService.getById(id);
    }
    @GetMapping("/settings")
    public List<AppSetting> queryAppSettings(@RequestParam("app_id") String appId, @RequestParam("group") String groupKey) {
        LambdaQueryWrapper<AppSetting> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppSetting::getAppId, appId);
        queryWrapper.eq(AppSetting::getGroupKey, groupKey);
        return appSettingService.list(queryWrapper);
    }

    /**
     * 根据用户账号查询用户信息
     * @param username
     * @return
     */
    @GetMapping("/getUserByName")
    public LoginUser getUserByName(@RequestParam("username") String username){
        return appMemberProvider.getUserByName(username);
    }


    /**
     * VUEN-2584【issue】平台sql注入漏洞几个问题
     * 部分特殊函数 可以将查询结果混夹在错误信息中，导致数据库的信息暴露
     * @param e
     * @return
     */
    @ExceptionHandler(java.sql.SQLException.class)
    public Result<?> handleSQLException(Exception e){
        String msg = e.getMessage();
        String extractvalue = "extractvalue";
        String updatexml = "updatexml";
        if(msg!=null && (msg.toLowerCase().indexOf(extractvalue)>=0 || msg.toLowerCase().indexOf(updatexml)>=0)){
            return Result.error("校验失败，sql解析异常！");
        }
        return Result.error("校验失败，sql解析异常！" + msg);
    }

    /**
     * 获取系统角色临时TOKEN
     * @return
     */
    @GetMapping("/system/token")
    public String getSystemTempToken() {
        LoginUser loginUser = systemApi.getUserByName("admin");
        return JwtUtil.sign(loginUser.getUsername(), loginUser.getPassword());
    }

    /**
     * 分销返佣
     * @param memberId
     * @param description
     * @param amount
     * @return
     */
    @PutMapping("/money/in")
    @Transactional(rollbackFor = Exception.class)
    public boolean addMemeberMoney(@RequestParam("member_id") String memberId, @RequestParam("description") String description, @RequestParam("amount") Float amount) {
        AppMember appMember = appMemberService.getById(memberId);
        if(appMember == null) {
            return false;
        }
        appMember.setMoney(BigDecimal.valueOf(appMember.getMoney()).add(BigDecimal.valueOf(amount)).floatValue());
        AppMemberMoneyRecord appMemberMoneyRecord = new AppMemberMoneyRecord();
        appMemberMoneyRecord.setType(2);
        appMemberMoneyRecord.setDescription(description);
        appMemberMoneyRecord.setMemberId(memberId);
        appMemberMoneyRecord.setMoney(Double.valueOf(amount));
        appMemberMoneyRecord.setStatus(1);
        appMemberMoneyRecordService.save(appMemberMoneyRecord);
        appMemberService.updateById(appMember);

        return true;
    }

    @GetMapping("/tencent/configs")
    public List<AppTencentConfig> allTencentConfigs() {
        return tencentConfigService.list();
    }
}
