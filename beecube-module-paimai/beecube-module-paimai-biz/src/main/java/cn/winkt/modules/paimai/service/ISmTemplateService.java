package cn.winkt.modules.paimai.service;

import cn.winkt.modules.paimai.entity.SmTemplate;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 营销短信模板表
 * @Author: jeecg-boot
 * @Date:   2023-06-06
 * @Version: V1.0
 */
public interface ISmTemplateService extends IService<SmTemplate> {
    /**
     * 异步群发短信
     */
    void send(String id);
}
