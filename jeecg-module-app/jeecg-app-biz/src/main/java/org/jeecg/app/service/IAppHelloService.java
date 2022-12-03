package org.jeecg.app.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.app.entity.AppHelloEntity;

/**
 * 测试接口
 */
public interface IAppHelloService extends IService<AppHelloEntity> {

    String hello();

}
