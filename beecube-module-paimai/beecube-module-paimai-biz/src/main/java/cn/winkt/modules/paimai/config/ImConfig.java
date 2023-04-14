package cn.winkt.modules.paimai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "im")
@Data
public class ImConfig {
    private String serverIp;
    private Integer udpPort;
    private Integer tcpPort;
    private Integer websocketPort;
    private Boolean debug;
}
