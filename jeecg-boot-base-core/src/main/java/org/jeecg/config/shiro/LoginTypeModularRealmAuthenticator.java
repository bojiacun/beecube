package org.jeecg.config.shiro;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.pam.ModularRealmAuthenticator;
import org.apache.shiro.realm.Realm;
import org.jeecg.common.system.util.JwtUtil;

import java.util.ArrayList;
import java.util.Collection;

public class LoginTypeModularRealmAuthenticator extends ModularRealmAuthenticator {
    @Override
    protected AuthenticationInfo doAuthenticate(AuthenticationToken authenticationToken) throws AuthenticationException {
        assertRealmsConfigured();
        JwtToken token = (JwtToken) authenticationToken;
        Collection<Realm> realms = getRealms();
        Collection<Realm> typedRealms = new ArrayList<>();
        LoginType loginType = token.getLoginType();
        for (Realm realm : realms) {
            if (realm.getName().startsWith(loginType.name())) {
                typedRealms.add(realm);
            }
        }

        if (typedRealms.size() == 1) {
            return this.doSingleRealmAuthentication(typedRealms.iterator().next(), authenticationToken);
        } else {
            return this.doMultiRealmAuthentication(typedRealms, authenticationToken);
        }
    }
}
