package cn.winkt.modules.paimai.lianlu.models;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import cn.winkt.modules.paimai.lianlu.common.*;
import java.util.HashMap;
import java.util.Map;

public class Product {
    private static final String Version = Constants.Version;
    // 签名类型 固定值：MD5
    private static final String SignType = Constants.MD5;

    private static final String prefix = "sms/product/";

    /**
     * 获取余额
     */
    public JSONObject GetBalance(Credential credential) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("balance");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Version);
        requestData.put("SignType", SignType);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), SignType));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 获取签名列表
     */
    public JSONObject GetSign(Credential credential) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("sign/get");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Version);
        requestData.put("SignType", SignType);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), SignType));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 创建签名
     */
    public JSONObject CreateSign(Credential credential, String content) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("sign/create");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Version);
        requestData.put("SignType", SignType);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("content", content);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), SignType));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 获取模板列表
     */
    public JSONObject GetTemplates(Credential credential) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("template/get");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Version);
        requestData.put("SignType", SignType);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), SignType));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 获取单个模板
     */
    public JSONObject GetTemplate(Credential credential, int TemplateId) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("template/getById");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Version);
        requestData.put("SignType", SignType);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("TemplateId", TemplateId);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), SignType));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 创建模板
     */
    public JSONObject CreateTemplate(Credential credential, int signId, String templateName, String content) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("template/create");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Version);
        requestData.put("SignType", SignType);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("SignId", signId);
        requestData.put("TemplateName", templateName);
        requestData.put("content", content);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), SignType));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }
}
