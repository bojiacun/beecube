package cn.winkt.modules.paimai.lianlu.models;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import cn.winkt.modules.paimai.lianlu.common.*;

import java.util.HashMap;
import java.util.Map;

public class EmptyCheck {
    private String[] PhoneList;

    public String[] getPhoneList() {
        return PhoneList;
    }

    public void setPhoneList(String[] phoneList) {
        PhoneList = phoneList;
    }

    private static final String prefix = "empty/";

    public EmptyCheck() {
    }

    /**
     * 空号检测
     */
    public JSONObject Check(Credential credential, EmptyCheck source) throws Exception {
        String url = Constants.DOMAIN_API.concat(prefix).concat("api/check");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("MchId", credential.getMchId());
        requestData.put("AppId", credential.getAppId());
        requestData.put("Version", Constants.Version);
        requestData.put("SignType", Constants.MD5);
        requestData.put("TimeStamp", String.valueOf(SystemClock.now()));
        requestData.put("PhoneList", source.getPhoneList());

        requestData.put("Signature", Encoder.generateSignature(requestData, credential.getAppKey(), Constants.MD5));
        return Request.requestOnce(url, JSON.toJSONString(requestData), credential.isHttp(), 10000, 10000);
    }
}
