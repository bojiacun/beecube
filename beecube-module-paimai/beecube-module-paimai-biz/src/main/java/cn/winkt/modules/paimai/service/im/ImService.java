package cn.winkt.modules.paimai.service.im;

import cn.winkt.modules.paimai.config.ImConfig;
import io.netty.handler.ssl.ClientAuth;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import lombok.extern.slf4j.Slf4j;
import net.x52im.mobileimsdk.server.ServerLauncher;
import net.x52im.mobileimsdk.server.network.Gateway;
import net.x52im.mobileimsdk.server.network.GatewayTCP;
import net.x52im.mobileimsdk.server.network.GatewayUDP;
import net.x52im.mobileimsdk.server.network.GatewayWebsocket;
import net.x52im.mobileimsdk.server.qos.QoS4ReciveDaemonC2S;
import net.x52im.mobileimsdk.server.qos.QoS4SendDaemonS2C;
import net.x52im.mobileimsdk.server.utils.ServerToolKits;
import org.apache.commons.io.IOUtils;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
@Slf4j
public class ImService extends ServerLauncher implements ApplicationRunner {


    @javax.annotation.Resource
    ImConfig imConfig;

    @javax.annotation.Resource
    ServerEventListenerImpl serverEventListener;

    @javax.annotation.Resource
    MessageQoSEventS2CListnerImpl messageQoSEventS2CListner;

    public ImService() throws IOException {
        super();
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        //启用服务
        // 设置MobileIMSDK服务端的UDP网络监听端口
        GatewayUDP.PORT       = imConfig.getUdpPort();
        // 设置MobileIMSDK服务端的TCP网络监听端口
        GatewayTCP.PORT       = imConfig.getTcpPort();
        // 设置MobileIMSDK服务端的WebSocket网络监听端口
        GatewayWebsocket.PORT = imConfig.getWebsocketPort();

        // 设置MobileIMSDK服务端仅支持UDP协议
//		ServerLauncher.supportedGateways = Gateway.SOCKET_TYPE_UDP;
        // 设置MobileIMSDK服务端仅支持TCP协议
//		ServerLauncher.supportedGateways = Gateway.SOCKET_TYPE_TCP;
        // 设置MobileIMSDK服务端仅支持WebSocket协议
//		ServerLauncher.supportedGateways = Gateway.SOCKET_TYPE_WEBSOCKET;
        // 设置MobileIMSDK服务端同时支持UDP、TCP、WebSocket三种协议
        ServerLauncher.supportedGateways = Gateway.SOCKET_TYPE_UDP | Gateway.SOCKET_TYPE_TCP | Gateway.SOCKET_TYPE_WEBSOCKET;

        // 开/关Demog日志的输出
        QoS4SendDaemonS2C.getInstance().setDebugable(imConfig.getDebug());
        QoS4ReciveDaemonC2S.getInstance().setDebugable(imConfig.getDebug());

        // 与客户端协商一致的心跳频率模式设置
//		ServerToolKits.setSenseModeUDP(SenseModeUDP.MODE_15S);
        ServerToolKits.setSenseModeTCP(ServerToolKits.SenseModeTCP.MODE_5S);
        ServerToolKits.setSenseModeWebsocket(ServerToolKits.SenseModeWebsocket.MODE_5S);
//		ServerToolKits.setSenseModeWebsocket(SenseModeWebsocket.MODE_30S);

        // 关闭与Web端的消息互通桥接器（其实SDK中默认就是false）
        ServerLauncher.bridgeEnabled = false;
        // TODO 跨服桥接器MQ的URI（本参数只在ServerLauncher.bridgeEnabled为true时有意义）
//		BridgeProcessor.IMMQ_URI = "amqp://js:19844713@192.168.0.190";

        // 设置最大TCP帧内容长度（不设置则默认最大是 6 * 1024字节）
//		GatewayTCP.TCP_FRAME_MAX_BODY_LENGTH = 60 * 1024;

        SslContext sslContext = createSslContext();
        // 开启TCP协议的SSL/TLS加密传输（请确保客户端也已开发SSL）
//		GatewayTCP.sslContext = sslContext;
        // 开启WebSocket协议的SSL/TLS加密传输（请确保SSL证书是正规CA签发，否则浏览器是不允许的）
//		GatewayWebsocket.sslContext = sslContext;


        // 实例化后记得startup哦，单独startup()的目的是让调用者可以延迟决定何时真正启动IM服务
//        final ImService sli = new ImService();

        // 启动MobileIMSDK服务端的Demo
        this.startup();

        final ImService that = this;

        // 加一个钩子，确保在JVM退出时释放netty的资源
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                that.shutdown();
            }
        });
    }

    @Override
    protected void initListeners() {
        // ** 设置各种回调事件处理实现类
        this.setServerEventListener(serverEventListener);
        this.setServerMessageQoSEventListener(messageQoSEventS2CListner);
    }



    /**
     * 创建SslContext对象，用于开启SSL/TLS加密传输。
     *
     * @return 如果成功创建则返回SslContext对象，否则返回null
     */
    private static SslContext createSslContext()
    {
        try {
            /** 示例 1：使用证书（证书位于绝对路径）*/
//			// 证书文件
//			File certChainFile = new File("c:/certs/netty-cert2.crt");
//			// 证书文件
//			File keyFile = new File("c:/certs/netty-key2.pk8");
//			// 私钥密码（注意：Netty只支持.pk8格式，如何生成，见JackJiang文章：）
//			String keyPassword = "123456";
//			// 生成SslContext对象（为了方便理解，此处使用的是单向认证）
//			SslContext sslCtx = SslContextBuilder.forServer(certChainFile, keyFile, keyPassword).clientAuth(ClientAuth.NONE).build();

            /** 示例 2：使用证书（证书位于相对路径）*/
            // TODO: 注意：请使用自已的证书，Demo中带的证书为自签名证书且已绑定域名，不安全！！！
            // 证书文件
            Resource certChainResource = new ClassPathResource("certs/netty-cert2.crt");
            InputStream certChainFile = certChainResource.getInputStream();
            // 私钥文件（注意：Netty只支持.pk8格式，如何生成，见JackJiang文章：）
            Resource keyFileResource = new ClassPathResource("certs/netty-key2.pk8");
            InputStream keyFile = keyFileResource.getInputStream();
            // 私钥密码（注意：Netty只支持.pk8格式，如何生成，见JackJiang文章：）
            String keyPassword = "123456";
            // 生成SslContext对象（为了方便理解，此处使用的是单向认证）
            SslContext sslCtx = SslContextBuilder.forServer(certChainFile, keyFile, keyPassword).clientAuth(ClientAuth.NONE).build();

            /** 示例 3：使用Netty自带的自签名证书（建议该证书仅用于测试使用）*/
//			SelfSignedCertificate ssc = new SelfSignedCertificate();
//			SslContext sslCtx = SslContextBuilder.forServer(ssc.certificate(), ssc.privateKey()).build();

            return sslCtx;
        } catch (Exception e) {
            log.warn("createSslContext()时出错了，原因："+e.getMessage(), e);
        }

        return null;
    }
}
