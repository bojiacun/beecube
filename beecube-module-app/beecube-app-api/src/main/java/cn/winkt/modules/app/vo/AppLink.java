package cn.winkt.modules.app.vo;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

@Data
public class AppLink {
    private String label;
    private String url;
    private AppLinkSuffix urlSuffix;
    private JSONObject suffixOptions;
}
