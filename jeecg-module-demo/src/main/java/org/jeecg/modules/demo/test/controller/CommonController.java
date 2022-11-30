package org.jeecg.modules.demo.test.controller;

import org.jeecg.common.api.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommonController {
    @GetMapping("/sys/common/403")
    public Result<?> noauth()  {
        return Result.error(403,"没有权限，请联系管理员授权");
    }
}
