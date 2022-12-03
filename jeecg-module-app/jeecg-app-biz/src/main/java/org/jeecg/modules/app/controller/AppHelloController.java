package org.jeecg.modules.app.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.modules.app.entity.AppHelloEntity;
import org.jeecg.modules.app.service.IAppHelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

@Api(tags = "app示例")
@RestController
@RequestMapping("/app")
@Slf4j
public class AppHelloController {

	@Autowired
	private IAppHelloService jeecgHelloService;

	@ApiOperation(value = "hello", notes = "对外服务接口")
	@GetMapping(value = "/hello")
	public String sayHello() {
		log.info(" ---我被调用了--- ");
		return jeecgHelloService.hello();
	}

}
