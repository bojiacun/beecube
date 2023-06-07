package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.SmtTemplateVO;
import cn.winkt.modules.paimai.entity.SmTemplate;
import cn.winkt.modules.paimai.entity.SmTemplateRecord;
import cn.winkt.modules.paimai.mapper.SmTemplateMapper;
import cn.winkt.modules.paimai.mapper.SmTemplateRecordMapper;
import cn.winkt.modules.paimai.service.ISmTemplateService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import jodd.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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

    @Resource
    private SmTemplateRecordMapper smTemplateRecordMapper;

    @Override
    @Async
    public void send(String id) {
        SmTemplate smTemplate = smTemplateMapper.selectById(id);
        List<AppMemberVO> members;
        if(smTemplate.getRuleMember() == 1) {
            members = appApi.getMembersByIds(Arrays.asList(smTemplate.getRuleMemberIds().split(",")));
        }
        else {
            members = appApi.getAllMembers();
        }

        members.forEach(appMemberVO -> {
            if(StringUtils.isNotEmpty(appMemberVO.getPhone())) {
                LambdaQueryWrapper<SmTemplateRecord> queryWrapper = new LambdaQueryWrapper<>();
                queryWrapper.eq(SmTemplateRecord::getMemberPhone, appMemberVO.getPhone());
                if(smTemplateRecordMapper.selectCount(queryWrapper) == 0) {
                    String[] params = smTemplate.getVars().split(";");
                    List<String> paramsArray = new ArrayList<>();
                    String memberName = StringUtils.getIfEmpty(appMemberVO.getRealname(), appMemberVO::getNickname);
                    for (String param : params) {
                        switch (param) {
                            case "{memberName}":
                                paramsArray.add(memberName);
                                break;
                            case "{url}":
                                paramsArray.add(smTemplate.getUrl());
                                break;
                        }
                    }
                    String[] args = paramsArray.toArray(params);
                    SmtTemplateVO vo = new SmtTemplateVO();
                    vo.setTemplateId(smTemplate.getTemplateId());
                    vo.setParams(args);
                    vo.setPhone(appMemberVO.getPhone());
                    if(appApi.sendSms(vo)) {
                        SmTemplateRecord smTemplateRecord = new SmTemplateRecord();
                        smTemplateRecord.setTemplateId(id);
                        smTemplateRecord.setMemberId(appMemberVO.getId());
                        smTemplateRecord.setMemberName(memberName);
                        smTemplateRecord.setMemberAvatar(appMemberVO.getAvatar());
                        smTemplateRecord.setMemberPhone(appMemberVO.getPhone());
                        smTemplateRecordMapper.insert(smTemplateRecord);
                    }
                }
            }
        });
    }
}
