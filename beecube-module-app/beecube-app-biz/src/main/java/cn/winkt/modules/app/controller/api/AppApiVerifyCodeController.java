package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.config.TencentSmsService;
import cn.winkt.modules.app.config.TencentSmsServices;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.config.AppContext;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/app/api/sms")
@Slf4j
public class AppApiVerifyCodeController {
   
    @Resource
    TencentSmsServices tencentSmsServices;

    @PostMapping("/send")
    public Result<Boolean> sendCode(@RequestBody Map<String, String> postData, HttpSession httpSession) {
        TencentSmsService service = tencentSmsServices.getService(AppContext.getApp());
        if(service == null) {
            throw new JeecgBootException("获取短信服务失败");
        }
        String mobile = postData.get("mobile");
        String vcode = RandomStringUtils.randomNumeric(6);
        service.sendCode(mobile, vcode);
        log.info("{} 手机号下发的短信验证码为{}", mobile, vcode);
        httpSession.setAttribute("MOBILE_CODE", vcode);
        return Result.OK(true);
    }
}
