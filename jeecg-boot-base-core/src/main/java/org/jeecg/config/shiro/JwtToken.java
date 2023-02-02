package org.jeecg.config.shiro;
 
import org.apache.shiro.authc.AuthenticationToken;

/**
 * @Author Scott
 * @create 2018-07-12 15:19
 * @desc
 **/
public class JwtToken implements AuthenticationToken {
	
	private static final long serialVersionUID = 1L;
	private String token;

    private LoginType loginType;

    public JwtToken(String token) {
        this(token, LoginType.Admin);
    }
    public JwtToken(String token, LoginType loginType) {
        this.token = token;
        this.loginType = loginType;
    }

    public LoginType getLoginType() {
        return this.loginType;
    }
 
    @Override
    public Object getPrincipal() {
        return token;
    }
 
    @Override
    public Object getCredentials() {
        return token;
    }
}
