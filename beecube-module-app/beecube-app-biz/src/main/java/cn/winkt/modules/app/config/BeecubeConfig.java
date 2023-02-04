package cn.winkt.modules.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "beecube")
@Data
public class BeecubeConfig {
    private String appUiPath;
}
