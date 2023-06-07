package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.SmtTemplateVO;
import cn.winkt.modules.paimai.entity.SmTemplate;
import cn.winkt.modules.paimai.mapper.SmTemplateMapper;
import cn.winkt.modules.paimai.service.ISmTemplateService;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;

/**
 * @Description: 营销短信模板表
 * @Author: jeecg-boot
 * @Date:   2023-06-06
 * @Version: V1.0
 */
@Service
public class SmTemplateServiceImpl extends ServiceImpl<SmTemplateMapper, SmTemplate> implements ISmTemplateService {

    @Resource
    private AppApi appApi;

    @Resource
    private SmTemplateMapper smTemplateMapper;

    @Override
    public void send(String id) {
        SmTemplate smTemplate = smTemplateMapper.selectById(id);
        SmtTemplateVO vo = new SmtTemplateVO();
        BeanUtils.copyProperties(smTemplate, vo);
        appApi.sendSms(vo);
    }
}
