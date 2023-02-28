package cn.winkt.modules.app.controller.api;


import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import cn.winkt.modules.app.service.IAppMemberMoneyRecordService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.query.QueryGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/app/api/members/money")
public class AppApiMemberMoneyController {

    @Resource
    IAppMemberMoneyRecordService appMemberMoneyRecordService;

    @GetMapping(value = "/records")
    public Result<?> queryPageList(@RequestParam(name = "type", defaultValue = "0") Integer type,
                                   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize
                                   ) {
        LambdaQueryWrapper<AppMemberMoneyRecord> queryWrapper = new LambdaQueryWrapper<>();
        if(type > 0) {
            queryWrapper.eq(AppMemberMoneyRecord::getType, type);
        }

        Page<AppMemberMoneyRecord> page = new Page<>(pageNo, pageSize);
        IPage<AppMemberMoneyRecord> pageList = appMemberMoneyRecordService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

}
