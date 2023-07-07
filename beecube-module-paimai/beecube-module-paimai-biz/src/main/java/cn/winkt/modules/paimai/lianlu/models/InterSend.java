package cn.winkt.modules.paimai.lianlu.models;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import cn.winkt.modules.paimai.lianlu.common.*;

import java.util.HashMap;
import java.util.Map;

public class InterSend {
    private String[] PhoneNumberSet;
    private String SessionContext;
    private String TemplateId;
    private String[] TemplateParamSet;

    // 公共参数
    private String TaskTime;
    private String Tag;
    private String TaskId;

    private int PageNo = 0;
    private int PageSize = 0;

    public String[] getPhoneNumberSet() {
        return PhoneNumberSet;
    }

    public void setPhoneNumberSet(String[] phoneNumberSet) {
        PhoneNumberSet = phoneNumberSet;
    }

    public String getSessionContext() {
        return SessionContext;
    }

    public void setSessionContext(String sessionContext) {
        SessionContext = sessionContext;
    }

    public String getTemplateId() {
        return TemplateId;
    }

    public void setTemplateId(String templateId) {
        TemplateId = templateId;
    }

    public String[] getTemplateParamSet() {
        return TemplateParamSet;
    }

    public void setTemplateParamSet(String[] templateParamSet) {
        TemplateParamSet = templateParamSet;
    }

    public String getTaskTime() {
        return TaskTime;
    }

    public void setTaskTime(String taskTime) {
        TaskTime = taskTime;
    }

    public String getTag() {
        return Tag;
    }

    public void setTag(String tag) {
        Tag = tag;
    }

    public String getTaskId() {
        return TaskId;
    }

    public void setTaskId(String taskId) {
        TaskId = taskId;
    }

    public int getPageNo() {
        return PageNo;
    }

    public void setPageNo(int pageNo) {
        PageNo = pageNo;
    }

    public int getPageSize() {
        return PageSize;
    }

    public void setPageSize(int pageSize) {
        PageSize = pageSize;
    }

    private static final String prefix = "sms/inter/";

    public InterSend() {}

    /**
     * 国际短信发送
     */
    public JSONObject Send(Credential credential, InterSend source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("send");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("TemplateId", source.getTemplateId());
        requestData.put("PhoneNumberSet", source.getPhoneNumberSet());
        requestData.put("TemplateParamSet", source.getTemplateParamSet());
        requestData.put("Type", 3);

        if(source.getTaskTime() != null) {
            requestData.put("TaskTime", source.getTaskTime());
        }
        if(source.getTag() != null) {
            requestData.put("Tag", source.getTag());
        }

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 国际短信回执
     */
    public JSONObject Report(Credential credential, InterSend source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("report");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("TaskId", source.getTaskId());

        if(source.getPageSize() != 0) {
            requestData.put("pageSize", source.getPageSize());
        }
        if(source.getPageNo() != 0) {
            requestData.put("pageNo", source.getPageSize());
        }
        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }
}
