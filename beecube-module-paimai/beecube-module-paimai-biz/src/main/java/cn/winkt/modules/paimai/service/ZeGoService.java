package cn.winkt.modules.paimai.service;


import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZeGoService {

    private static final String ZEGO_BASE_URL = "https://rtc-api.zego.im/";

    /**
     * 测试获取房间内用户数目
     */
    public String describeUserNum() {
        // 请填写你要统计的房间ID
        String roomId = "room1";
        // 请填写你从控制台获取的APP ID,
        // 举例：1234567890L，APP_ID为 Long 型
        Long APP_ID = 296889649L;
        // 请填写你从控制后台获取的SERVER SECRET，
        // 举例："abcde1234aaaaaaaabbbbbbb"
        String SERVER_SECRET = "d0b4b019c53947f30bf4420b2df23af6";
        // 生成16进制随机字符串(16位)
        byte[] bytes = new byte[8];
        SecureRandom sr = new SecureRandom();
        sr.nextBytes(bytes);
        String signatureNonce = bytesToHex(bytes);
        // 设定时间戳
        long timestamp = System.currentTimeMillis() / 1000L;

        // 生成签名Signature=md5(AppId + SignatureNonce + ServerSecret + Timestamp)
        String signatue = generateSignature(APP_ID, signatureNonce, SERVER_SECRET, timestamp);

        // 组装请求URL
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("Action", "DescribeUserNum");
        params.put("RoomId[]", roomId);
        params.put("AppId", APP_ID);
        // 公共参数中的随机数和生成签名的随机数要一致
        params.put("SignatureNonce", signatureNonce);
        // 公共参数中的时间戳和生成签名的时间戳要一致
        params.put("Timestamp", timestamp);
        params.put("Signature", signatue);
        params.put("SignatureVersion", "2.0");
        String url = buildAPIUrl("https://rtc-api.zego.im/", params);

        String result = sendGet(url);
        return result;
    }

    /**
     * 生成签名
     * @param appId 应用 AppId
     * @param signatureNonce 签名随机码
     * @param serverSecret 服务端API密钥
     * @param timestamp 签名时间戳
     * @return 生成的签名字符串
     */
    public String generateSignature(long appId, String signatureNonce, String serverSecret, long timestamp){
        String str = String.valueOf(appId) + signatureNonce + serverSecret + String.valueOf(timestamp);
        String signature = "";
        try{
            //创建一个提供信息摘要算法的对象，初始化为md5算法对象
            MessageDigest md = MessageDigest.getInstance("MD5");
            //计算后获得字节数组
            byte[] bytes = md.digest(str.getBytes("utf-8"));
            //把数组每一字节换成16进制连成md5字符串
            signature = bytesToHex(bytes);
        }catch (Exception e) {
            e.printStackTrace();
        }
        return signature;
    }

    /**
     * 字节数组转16进制
     * @param bytes 需要转换的byte数组
     * @return 转换后的Hex字符串
     */
    public String bytesToHex(byte[] bytes) {
        StringBuffer md5str = new StringBuffer();
        //把数组每一字节换成16进制连成md5字符串
        int digital;
        for (int i = 0; i < bytes.length; i++) {
            digital = bytes[i];
            if (digital < 0) {
                digital += 256;
            }
            if (digital < 16) {
                md5str.append("0");
            }
            md5str.append(Integer.toHexString(digital));
        }
        return md5str.toString();
    }
    /**
     * 发送HTTP-GET请求
     * @param httpurl 请求路径
     * @return 响应内容
     */
    public String sendGet(String httpurl) {
        HttpURLConnection connection = null;
        InputStream is = null;
        BufferedReader br = null;
        String result = null;// 返回结果字符串
        try {
            // 创建远程url连接对象
            URL url = new URL(httpurl);
            // 通过远程url连接对象打开一个连接，强转成httpURLConnection类
            connection = (HttpURLConnection) url.openConnection();
            // 设置连接方式：get
            connection.setRequestMethod("GET");
            // 设置连接主机服务器的超时时间：15000毫秒
            connection.setConnectTimeout(15000);
            // 设置读取远程返回的数据时间：60000毫秒
            connection.setReadTimeout(60000);
            // 发送请求
            connection.connect();
            // 通过connection连接，获取输入流
            if (connection.getResponseCode() == 200) {
                is = connection.getInputStream();
                // 封装输入流is，并指定字符集
                br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
                // 存放数据
                StringBuffer sbf = new StringBuffer();
                String temp = null;
                while ((temp = br.readLine()) != null) {
                    sbf.append(temp);
                    sbf.append("\r\n");
                }
                result = sbf.toString();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭资源
            if (null != br) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (null != is) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            connection.disconnect();// 关闭远程连接
        }
        return result;
    }
    /**
     * 组装API地址字符串
     * @param url API地址
     * @param params 请求参数
     * @return 组装好的API地址字符串
     */
    public String buildAPIUrl(String url, Map<String, Object> params) {
        if(params.isEmpty()) {
            return url;
        }
        StringBuffer buffer = new StringBuffer(url).append("?");
        for(String key : params.keySet()) {
            buffer.append(key).append("=").append(params.get(key)).append("&");
        }
        String apiurl = buffer.toString();
        if(apiurl.endsWith("&")) {
            return apiurl.substring(0, apiurl.length()-1);
        } else {
            return apiurl;
        }
    }
}
