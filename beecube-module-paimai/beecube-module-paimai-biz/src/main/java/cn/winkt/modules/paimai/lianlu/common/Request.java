package cn.winkt.modules.paimai.lianlu.common;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.BasicHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;

public class Request {

    /**
     * 请求，只请求一次，不做重试
     *
     */
    public static JSONObject requestOnce(String url, String data, boolean isHttp, int connectTimeoutMs, int readTimeoutMs) throws Exception {
        BasicHttpClientConnectionManager connManager;
        connManager = new BasicHttpClientConnectionManager(RegistryBuilder.<ConnectionSocketFactory>create().register("http", PlainConnectionSocketFactory.getSocketFactory()).register("https", SSLConnectionSocketFactory.getSocketFactory()).build(), null, null, null);

        HttpClient httpClient = HttpClientBuilder.create().setConnectionManager(connManager).build();
        if (isHttp) {
            url = Constants.HTTP + url;
        }
        else {
            url = Constants.HTTPS + url;
        }
        HttpPost httpPost = new HttpPost(url);

        int retryCount = 0;
        boolean requestSuccess = false;
        while (!requestSuccess && retryCount < 3) {
            try {
                RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(readTimeoutMs).setConnectTimeout(connectTimeoutMs).build();
                httpPost.setConfig(requestConfig);

                StringEntity postEntity = new StringEntity(data, "UTF-8");
                httpPost.addHeader("Content-Type", "application/json");
                httpPost.setEntity(postEntity);

                HttpResponse httpResponse = httpClient.execute(httpPost);
                int statusCode = httpResponse.getStatusLine().getStatusCode();
                if (statusCode >= 200 && statusCode < 300) {
                    requestSuccess = true;
                    HttpEntity httpEntity = httpResponse.getEntity();

                    String jsonStr = EntityUtils.toString(httpEntity, "UTF-8");

                    return JSON.parseObject(jsonStr);
                    // 在这里处理请求成功的响应
                } else {
                    return new JSONObject();
                    // 在这里处理请求失败的响应
                }

            } catch (Exception e) {
                retryCount++;
                if (retryCount >= 3) {
                    // 在这里处理重试次数达到最大值的情况
                    e.printStackTrace();
                } else {
                    // 等待1秒钟后再次尝试请求
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        }
        return new JSONObject();
    }
}
