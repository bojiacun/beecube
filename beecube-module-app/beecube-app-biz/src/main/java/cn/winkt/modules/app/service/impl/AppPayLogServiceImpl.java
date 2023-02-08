package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppPayLog;
import cn.winkt.modules.app.mapper.AppPayLogMapper;
import cn.winkt.modules.app.service.IAppPayLogService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 支付记录表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class AppPayLogServiceImpl extends ServiceImpl<AppPayLogMapper, AppPayLog> implements IAppPayLogService {

}
