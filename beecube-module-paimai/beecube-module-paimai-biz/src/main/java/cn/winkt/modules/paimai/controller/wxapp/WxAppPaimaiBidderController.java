package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.PaimaiBidder;
import cn.winkt.modules.paimai.service.IPaimaiBidderService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/bidder")
public class WxAppPaimaiBidderController {

    @Resource
    private IPaimaiBidderService paimaiBidderService;

    @GetMapping("/count/performance")
    public Result<Long> countByPerformance(@RequestParam String id) {
        LambdaQueryWrapper<PaimaiBidder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(PaimaiBidder::getPerformanceId, id);
        return Result.OK(paimaiBidderService.count(queryWrapper));
    }
}
