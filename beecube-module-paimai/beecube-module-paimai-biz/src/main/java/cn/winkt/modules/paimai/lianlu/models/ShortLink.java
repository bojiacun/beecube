package cn.winkt.modules.paimai.lianlu.models;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import cn.winkt.modules.paimai.lianlu.common.*;

import java.util.HashMap;
import java.util.Map;

public class ShortLink {
    // 必须
    private String shortName;
    private String url;
    private String domain;
    private String accessDeadline;

    private String[] phoneSet;

    // 非必需
    private String accessPassword;
    private String accessTimes;
    private String id;

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getAccessDeadline() {
        return accessDeadline;
    }

    public void setAccessDeadline(String accessDeadline) {
        this.accessDeadline = accessDeadline;
    }

    public String getAccessPassword() {
        return accessPassword;
    }

    public void setAccessPassword(String accessPassword) {
        this.accessPassword = accessPassword;
    }

    public String getAccessTimes() {
        return accessTimes;
    }

    public void setAccessTimes(String accessTimes) {
        this.accessTimes = accessTimes;
    }

    public String[] getPhoneSet() {
        return phoneSet;
    }

    public void setPhoneSet(String[] phoneSet) {
        this.phoneSet = phoneSet;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    private static final String prefix = "shortLink/";

    public ShortLink() {
    }

    /**
     * 创建普通短链
     */
    public JSONObject create(Credential credential, ShortLink source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("create");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("shortName", source.getShortName());
        requestData.put("url", source.getUrl());
        requestData.put("domain", source.getDomain());
        requestData.put("accessDeadline", source.getAccessDeadline());

        if(source.getAccessPassword() != null) {
            requestData.put("accessPassword", source.getAccessPassword());
        }
        if(source.getAccessTimes() != null) {
            requestData.put("accessTimes", source.getAccessTimes());
        }

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 创建号码跟踪
     */
    public JSONObject batchCreate(Credential credential, ShortLink source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("batchCreate");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("shortName", source.getShortName());
        requestData.put("url", source.getUrl());
        requestData.put("domain", source.getDomain());
        requestData.put("accessDeadline", source.getAccessDeadline());
        requestData.put("phoneSet", source.getPhoneSet());

        if(source.getId() != null) {
            requestData.put("id", source.getId());
        }
        if(source.getAccessPassword() != null) {
            requestData.put("accessPassword", source.getAccessPassword());
        }
        if(source.getAccessTimes() != null) {
            requestData.put("accessTimes", source.getAccessTimes());
        }

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 删除短链
     */
    public JSONObject delete(Credential credential, ShortLink source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("delete");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("id", source.getId());

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 用户信息查询
     */
    public JSONObject queryInfo(Credential credential, ShortLink source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("queryInfo");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }
}
