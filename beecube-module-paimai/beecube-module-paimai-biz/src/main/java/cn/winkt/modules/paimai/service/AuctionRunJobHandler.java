package cn.winkt.modules.paimai.service;

import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuctionRunJobHandler {

    @XxlJob(value = "RUN_AUCTION")
    public ReturnT<String> runningAuction(String params) {
        log.info("我是定时任务，我执行了哦");
        return ReturnT.SUCCESS;
    }
}
