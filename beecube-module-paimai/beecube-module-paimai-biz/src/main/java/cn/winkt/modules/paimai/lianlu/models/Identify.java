package cn.winkt.modules.paimai.lianlu.models;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import cn.winkt.modules.paimai.lianlu.common.*;

import java.util.HashMap;
import java.util.Map;

public class Identify {

    private static final String prefix = "identification/";

    /**
     * 身份证二要素
     */
    public JSONObject IdCard2(Credential credential, String name, String idNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("idCard/auth");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("idNum", idNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 身份证四要素
     */
    public JSONObject IdCard4(Credential credential, String name, String idNum, String startTime, String endTime) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("idCard/auth/valid");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("idNum", idNum);
        requestData.put("startTime", startTime);
        requestData.put("endTime", endTime);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 运营商二要素
     */
    public JSONObject isp2(Credential credential, String name, String phone) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("isp/auth");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("phone", phone);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 运营商三要素
     */
    public JSONObject isp3(Credential credential, String name, String phone, String idNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("isp/auth/three");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("phone", phone);
        requestData.put("idNum", idNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 运营商三要素详细版
     */
    public JSONObject isp3d(Credential credential, String name, String phone, String idNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("isp/auth/three/detail");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("phone", phone);
        requestData.put("idNum", idNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 银行卡二要素
     */
    public JSONObject bank2(Credential credential, String name, String bankNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("bank/auth");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("bankNum", bankNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 银行卡三要素
     */
    public JSONObject bank3(Credential credential, String name, String bankNum, String idNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("bank/auth/three");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("bankNum", bankNum);
        requestData.put("idNum", idNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 银行卡三要素详细版
     */
    public JSONObject bank3d(Credential credential, String name, String bankNum, String idNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("bank/auth/three/detail");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("bankNum", bankNum);
        requestData.put("idNum", idNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 银行卡四要素
     */
    public JSONObject bank4(Credential credential, String name, String bankNum, String idNum, String phone) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("bank/auth/four");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("bankNum", bankNum);
        requestData.put("idNum", idNum);
        requestData.put("phone", phone);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 银行卡四要素详细
     */
    public JSONObject bank4d(Credential credential, String name, String bankNum, String idNum, String phone) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("bank/auth/four/detail");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("name", name);
        requestData.put("bankNum", bankNum);
        requestData.put("idNum", idNum);
        requestData.put("phone", phone);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 人像对比
     */
    public JSONObject idMatch(Credential credential, String image, String name, String idNum) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("idMatch");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("image", image);
        requestData.put("name", name);
        requestData.put("idNum", idNum);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 号码实时查询
     */
    public JSONObject phoneRealTime(Credential credential, String phone) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("phoneRealTime");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("phone", phone);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

    /**
     * 号码在网时长
     */
    public JSONObject phoneOnlineTime(Credential credential, String phone) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("phoneOnlineTime");
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("phone", phone);

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }

}
