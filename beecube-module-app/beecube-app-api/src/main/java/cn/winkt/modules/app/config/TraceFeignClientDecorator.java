package cn.winkt.modules.app.config;

import feign.Client;
import feign.Request;
import feign.Response;

import java.io.IOException;

public class TraceFeignClientDecorator implements Client {

    private final Client delegate;

    public TraceFeignClientDecorator(Client delegate) {
        this.delegate = delegate;
    }
    @Override
    public Response execute(Request request, Request.Options options) throws IOException {
        Response response = delegate.execute(request, options);

        return response;
    }
}
