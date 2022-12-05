package org.jeecg.modules.paimai.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.paimai.entity.PaimaiHelloEntity;
import org.jeecg.modules.paimai.mapper.PaimaiHelloMapper;
import org.jeecg.modules.paimai.service.IPaimaiHelloService;
import org.springframework.stereotype.Service;

/**
 * 测试Service
 */
@Service
public class PaimaiHelloServiceImpl extends ServiceImpl<PaimaiHelloMapper, PaimaiHelloEntity> implements IPaimaiHelloService {

    @Override
    public String hello() {
        return "hello ，我是 paimai 微服务节点!";
    }
}
