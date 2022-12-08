package cn.winkt.modules.paimai.service.impl;


import cn.winkt.modules.paimai.entity.PaimaiHelloEntity;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import cn.winkt.modules.paimai.mapper.PaimaiHelloMapper;
import cn.winkt.modules.paimai.service.IPaimaiHelloService;
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
