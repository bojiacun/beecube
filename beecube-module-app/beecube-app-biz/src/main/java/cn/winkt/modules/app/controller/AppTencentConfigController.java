package cn.winkt.modules.app.controller;

import cn.winkt.modules.app.config.MiniAppOpenService;
import cn.winkt.modules.app.entity.AppTencentConfig;
import cn.winkt.modules.app.service.IAppTencentConfigService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.base.controller.JeecgController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
* @Description: 腾讯云配置表
* @Author: jeecg-boot
* @Date:   2023-04-01
* @Version: V1.0
*/
@Slf4j
@Api(tags="腾讯云配置表")
@RestController
@RequestMapping("/tencent/configs")
public class AppTencentConfigController extends JeecgController<AppTencentConfig, IAppTencentConfigService> {
   @Autowired
   private IAppTencentConfigService appTencentConfigService;


   /**
    * 列表查询
    *
    * @return
    */
   @AutoLog(value = "腾讯云配置表-分页列表查询")
   @ApiOperation(value="腾讯云配置表-分页列表查询", notes="腾讯云配置表-分页列表查询")
   @GetMapping(value = "/list")
   public Result<?> queryList() {
       return Result.OK(appTencentConfigService.list());
   }

    @AutoLog(value = "腾讯云配置表-编辑")
    @ApiOperation(value="腾讯云配置表-编辑", notes="腾讯云配置表-编辑")
    @RequestMapping(value = "/updateAll", method = RequestMethod.POST)
    @Transactional(rollbackFor = Exception.class)
    public Result<?> updateAll(@RequestBody JSONObject jsonObject) {
        LambdaQueryWrapper<AppTencentConfig> removeQueryWrapper = new LambdaQueryWrapper<>();
        appTencentConfigService.remove(removeQueryWrapper);

        jsonObject.keySet().forEach(key-> {
            AppTencentConfig config = new AppTencentConfig();
            config.setSettingValue(jsonObject.getString(key));
            config.setSettingKey(key);
            appTencentConfigService.save(config);
        });
        return Result.OK("更新成功!");
    }
}
