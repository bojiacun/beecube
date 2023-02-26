package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.config.TencentSmsService;
import cn.winkt.modules.app.config.TencentSmsServices;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.config.AppContext;
import org.springframework.web.bind.annotation.*;

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
        httpSession.setAttribute("MOBILE_CODE", mobile+":"+vcode);
        return Result.OK(true);
    }

    @PutMapping("/check")
    public Result<Boolean> checkCode(@RequestBody Map<String, String> postData, HttpSession httpSession) {
        String mobile = postData.get("mobile");
        String code = postData.get("code");
        String vcode = (String)httpSession.getAttribute("MOBILE_CODE");
        if(vcode.equals(mobile+":"+code)) {
            return Result.OK(true);
        }
        return Result.OK(false);
    }
}
