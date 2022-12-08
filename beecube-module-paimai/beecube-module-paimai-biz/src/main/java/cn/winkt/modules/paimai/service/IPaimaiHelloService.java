package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.PaimaiHelloEntity;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 测试接口
 */
public interface IPaimaiHelloService extends IService<PaimaiHelloEntity> {

    String hello();

}
