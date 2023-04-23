package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.PayLog;
import cn.winkt.modules.paimai.mapper.PayLogMapper;
import cn.winkt.modules.paimai.service.IPayLogService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 微信支付记录
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class PayLogServiceImpl extends ServiceImpl<PayLogMapper, PayLog> implements IPayLogService {

}
