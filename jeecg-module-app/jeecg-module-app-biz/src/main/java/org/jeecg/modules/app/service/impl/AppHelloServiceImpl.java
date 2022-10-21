package org.jeecg.modules.app.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.app.entity.AppHelloEntity;
import org.jeecg.modules.app.mapper.AppHelloMapper;
import org.jeecg.modules.app.service.IAppHelloService;
import org.springframework.stereotype.Service;

/**
 * 测试Service
 */
@Service
public class AppHelloServiceImpl extends ServiceImpl<AppHelloMapper, AppHelloEntity> implements IAppHelloService {

    @Override
    public String hello() {
        return "hello ，我是 app 微服务节点!";
    }
}
