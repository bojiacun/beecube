package cn.winkt.modules.paimai.config;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.constant.AppModuleConstants;
import cn.winkt.modules.app.vo.AppSettingVO;
import com.rabbitmq.client.Channel;
import org.jeecg.boot.starter.rabbitmq.core.BaseRabbiMqHandler;
import org.jeecg.boot.starter.rabbitmq.listenter.MqListener;
import org.jeecg.common.annotation.RabbitComponent;
import org.quartz.SimpleTrigger;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.annotation.Header;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;


@RabbitListener(queues = AppModuleConstants.APP_SETTINGS_QUEUE)
@RabbitComponent(value = "AppSettingsChangedListener")
public class AppSettingsChangedListener extends BaseRabbiMqHandler<String> {

    @Resource
    MiniappServices miniappServices;

    @Resource
    AppApi appApi;

    @RabbitHandler
    public void onMessage(String appId, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
        super.onMessage(appId, deliveryTag, channel, new MqListener<String>(){
            @Override
            public void handler(String map, Channel channel) {
                List<AppSettingVO> settings = appApi.queryAppSettings(map, "wxapp");
                settings.forEach(s -> {
                    if(s.getSettingKey().equals("appid")) {
                        miniappServices.clear(s.getSettingValue());
                    }
                });
            }
        });
    }
}
