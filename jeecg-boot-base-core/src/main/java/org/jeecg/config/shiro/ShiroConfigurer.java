package org.jeecg.config.shiro;

import org.apache.shiro.realm.Realm;

import javax.servlet.Filter;
import java.util.Collection;
import java.util.Map;

public interface ShiroConfigurer {
    Collection<Realm> extendRealms();
    Map<String, Filter> extendFilters();
}
