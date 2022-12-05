package org.jeecg.modules.paimai.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.paimai.entity.PaimaiHelloEntity;

/**
 * 测试接口
 */
public interface IPaimaiHelloService extends IService<PaimaiHelloEntity> {

    String hello();

}
