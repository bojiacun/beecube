package cn.winkt.modules.paimai.service.impl;

import cn.binarywang.wx.miniapp.api.WxMaLinkService;
import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.shortlink.GenerateShortLinkRequest;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.app.vo.SmtTemplateVO;
import cn.winkt.modules.paimai.config.MiniappServices;
import cn.winkt.modules.paimai.entity.SmTemplate;
import cn.winkt.modules.paimai.entity.SmTemplateRecord;
import cn.winkt.modules.paimai.lianlu.common.Credential;
import cn.winkt.modules.paimai.lianlu.models.SmsSend;
import cn.winkt.modules.paimai.mapper.SmTemplateMapper;
import cn.winkt.modules.paimai.mapper.SmTemplateRecordMapper;
import cn.winkt.modules.paimai.service.IGoodsCommonDescService;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.ISmTemplateService;
import cn.winkt.modules.paimai.vo.GoodsSettings;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import jodd.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.config.AppContext;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @Description: 营销短信模板表
 * @Author: jeecg-boot
 * @Date: 2023-06-06
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

    @Resource
    private MiniappServices miniappServices;

    private Credential credential;


    @Resource
    private IGoodsCommonDescService goodsCommonDescService;

    @Override
    @Async
    @Transactional(rollbackFor = Exception.class)
    public void send(String id, String appId) {
        AppContext.setApp(appId);
        GoodsSettings goodsSettings = goodsCommonDescService.queryGoodsSettings();
        if (credential == null) {
            credential = new Credential(goodsSettings.getLianluCorpId(), goodsSettings.getLianluAppId(), goodsSettings.getLianluAppKey());
        }
        SmTemplate smTemplate = smTemplateMapper.selectById(id);
        List<AppMemberVO> members;
        if (smTemplate.getRuleMember() == 1) {
            members = appApi.getMembersByIds(Arrays.asList(smTemplate.getRuleMemberIds().split(",")));
        } else {
            members = appApi.getAllMembers();
        }
        LambdaQueryWrapper<SmTemplateRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SmTemplateRecord::getTemplateId, smTemplate.getTemplateId());
        List<SmTemplateRecord> sendedRecords = smTemplateRecordMapper.selectList(queryWrapper);
        members = members.stream().filter(appMemberVO -> {
            if (StringUtils.isEmpty(appMemberVO.getPhone())) {
                return false;
            }
            boolean sended = false;
            for (SmTemplateRecord smTemplateRecord : sendedRecords) {
                if (smTemplateRecord.getMemberPhone().equals(appMemberVO.getPhone())) {
                    sended = true;
                    break;
                }
            }
            return !sended;
        }).collect(Collectors.toList());

        String url = smTemplate.getUrl();
//        try {
//            WxMaLinkService wxMaLinkService = miniappServices.getWxMaLinkService(AppContext.getApp());
//            url = wxMaLinkService.generateShortLink(GenerateShortLinkRequest.builder().isPermanent(false).pageTitle(smTemplate.getTitle()).pageUrl(url).build());
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
        String templateStr = smTemplate.getVars().replaceAll("\\{url\\}", url);
        String[] sendPhoneNumbers = members.stream().map(AppMemberVO::getPhone).collect(Collectors.joining(",")).split(",");
        if (sendPhoneNumbers.length > 0) {
            SmsSend smsSend = new SmsSend();
            smsSend.setTemplateType("3");
            smsSend.setPhoneNumberSet(sendPhoneNumbers);
            smsSend.setTemplateId(smTemplate.getTemplateId());
            smsSend.setTemplateParamSet(templateStr.split(","));
            smsSend.setSignName(goodsSettings.getLianluSignName());

            try {
                smsSend.TemplateSend(credential, smsSend);
                for (AppMemberVO appMemberVO : members) {
                    SmTemplateRecord smTemplateRecord = new SmTemplateRecord();
                    smTemplateRecord.setTemplateId(id);
                    smTemplateRecord.setMemberId(appMemberVO.getId());
                    smTemplateRecord.setMemberName(StringUtils.getIfEmpty(appMemberVO.getRealname(), appMemberVO::getNickname));
                    smTemplateRecord.setMemberAvatar(appMemberVO.getAvatar());
                    smTemplateRecord.setMemberPhone(appMemberVO.getPhone());
                    smTemplateRecordMapper.insert(smTemplateRecord);
                }
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }

        }
    }
}
