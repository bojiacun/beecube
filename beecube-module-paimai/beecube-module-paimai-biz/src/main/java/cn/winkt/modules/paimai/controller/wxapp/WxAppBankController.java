package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Bank;
import cn.winkt.modules.paimai.service.IBankService;
import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/banks")
public class WxAppBankController {

    @Resource
    private IBankService bankService;

    @GetMapping
    public Result<List<Bank>> allLis() {
        return Result.OK(bankService.list());
    }
}
