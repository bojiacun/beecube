package org.jeecg.config.feign;

import com.alibaba.fastjson.JSONObject;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.jeecg.common.api.vo.Result;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

@Configuration
@Slf4j
public class FeignClientErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String s, Response response) {
        if(response.status() == HttpStatus.SC_OK) {
            try {
                String errorBody = IOUtils.toString(response.body().asInputStream(), StandardCharsets.UTF_8);
                Result<?> result = JSONObject.parseObject(errorBody, Result.class);
                
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }
        return null;
    }
}
