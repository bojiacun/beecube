package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.config.AppMemberProvider;
import com.alibaba.fastjson.JSONObject;
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
     * 获取数据字典
     * @param code
     * @return
     */
    @GetMapping("/queryDictItemsByCode")
    List<DictModel> queryDictItemsByCode(@RequestParam("code") String code){
        return appMemberProvider.queryDictItemsByCode(code);
    }

    /**
     * 获取有效的数据字典
     * @param code
     * @return
     */
    @GetMapping("/queryEnableDictItemsByCode")
    List<DictModel> queryEnableDictItemsByCode(@RequestParam("code") String code){
        return appMemberProvider.queryEnableDictItemsByCode(code);
    }




    /**
     * 根据 id 查询数据库中存储的 DynamicDataSourceModel
     *
     * @param dbSourceId
     * @return
     */
    @GetMapping("/getDynamicDbSourceById")
    DynamicDataSourceModel getDynamicDbSourceById(@RequestParam("dbSourceId")String dbSourceId){
        return appMemberProvider.getDynamicDbSourceById(dbSourceId);
    }



    /**
     * 根据 code 查询数据库中存储的 DynamicDataSourceModel
     *
     * @param dbSourceCode
     * @return
     */
    @GetMapping("/getDynamicDbSourceByCode")
    public DynamicDataSourceModel getDynamicDbSourceByCode(@RequestParam("dbSourceCode") String dbSourceCode){
        return appMemberProvider.getDynamicDbSourceByCode(dbSourceCode);
    }






    /**
     * 查询数据权限
     * @return
     */
    @GetMapping("/queryPermissionDataRule")
    public List<SysPermissionDataRuleModel> queryPermissionDataRule(@RequestParam("component") String component, @RequestParam("requestPath")String requestPath, @RequestParam("username") String username){
        return appMemberProvider.queryPermissionDataRule(component, requestPath, username);
    }

    /**
     * 查询用户信息
     * @param username
     * @return
     */
    @GetMapping("/getCacheUser")
    public SysUserCacheInfo getCacheUser(@RequestParam("username") String username){
        return appMemberProvider.getCacheUser(username);
    }

    /**
     * 普通字典的翻译
     * @param code
     * @param key
     * @return
     */
    @GetMapping("/translateDict")
    public String translateDict(@RequestParam("code") String code, @RequestParam("key") String key){
        return appMemberProvider.translateDict(code, key);
    }




    /**
     * 48 普通字典的翻译，根据多个dictCode和多条数据，多个以逗号分割
     * @param dictCodes
     * @param keys
     * @return
     */
    @GetMapping("/translateManyDict")
    public Map<String, List<DictModel>> translateManyDict(@RequestParam("dictCodes") String dictCodes, @RequestParam("keys") String keys){
        return this.appMemberProvider.translateManyDict(dictCodes, keys);
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
