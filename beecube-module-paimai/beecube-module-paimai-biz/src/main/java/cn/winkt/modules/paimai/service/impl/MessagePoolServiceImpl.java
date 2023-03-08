package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.MessagePool;
import cn.winkt.modules.paimai.mapper.MessagePoolMapper;
import cn.winkt.modules.paimai.service.IMessagePoolService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 拍卖消息队列表
 * @Author: jeecg-boot
 * @Date:   2023-03-08
 * @Version: V1.0
 */
@Service
public class MessagePoolServiceImpl extends ServiceImpl<MessagePoolMapper, MessagePool> implements IMessagePoolService {

}
