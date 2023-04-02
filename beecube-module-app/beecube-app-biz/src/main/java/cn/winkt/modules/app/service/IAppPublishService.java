package cn.winkt.modules.app.service;

import cn.winkt.modules.app.entity.AppPublish;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 应用前端发布版本表
 * @Author: jeecg-boot
 * @Date:   2023-04-02
 * @Version: V1.0
 */
public interface IAppPublishService extends IService<AppPublish> {
    AppPublish getLatestPublish();
}
