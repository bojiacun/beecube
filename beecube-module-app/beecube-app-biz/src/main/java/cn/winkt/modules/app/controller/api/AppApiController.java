package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppSetting;
import cn.winkt.modules.app.service.IAppMemberService;
import cn.winkt.modules.app.service.IAppSettingService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.jeecg.common.api.dto.DataLogDTO;
import org.jeecg.common.api.dto.OnlineAuthDTO;
import org.jeecg.common.api.dto.message.*;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.vo.*;
import org.jeecg.common.util.SqlInjectionUtil;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/app/api")
public class AppApiController {
    
    @Resource
    AppMemberProvider appMemberProvider;

    @Resource
    IAppMemberService appMemberService;

    @Resource
    IAppSettingService appSettingService;


    @GetMapping("/getMemberById")
    public AppMember queryAppMember(@RequestParam("id") String id) {
        return appMemberService.getById(id);
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
}
