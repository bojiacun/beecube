package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Bank;
import cn.winkt.modules.paimai.mapper.BankMapper;
import cn.winkt.modules.paimai.service.IBankService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 银行信息
 * @Author: jeecg-boot
 * @Date:   2023-05-30
 * @Version: V1.0
 */
@Service
public class BankServiceImpl extends ServiceImpl<BankMapper, Bank> implements IBankService {

}
