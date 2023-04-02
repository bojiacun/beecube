package cn.winkt.modules.app.service.impl;

import cn.winkt.modules.app.entity.AppPublish;
import cn.winkt.modules.app.mapper.AppPublishMapper;
import cn.winkt.modules.app.service.IAppPublishService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 应用前端发布版本表
 * @Author: jeecg-boot
 * @Date:   2023-04-02
 * @Version: V1.0
 */
@Service
public class AppPublishServiceImpl extends ServiceImpl<AppPublishMapper, AppPublish> implements IAppPublishService {
    @Resource
    private AppPublishMapper appPublishMapper;

    @Override
    public AppPublish getLatestPublish() {
        return appPublishMapper.getLatestPublish();
    }
}
