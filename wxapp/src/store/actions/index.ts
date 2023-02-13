import {
    SET_CONTEXT, SET_GEO,
    SET_PAGELOADING, SET_POSITION,
    SET_REFERER,
    SET_SETTINGS,
    SET_SIETINFO, SET_SITE,
    SET_TABS,
    SET_USERINFO
} from "../constants"
import {Context, LatLng} from "../../types/context";
import {Action} from "../../types/action";
import {TabBarItem} from "../../components/tabbar";


export const setUserInfo = (userInfo) => {
    return {
        type: SET_USERINFO,
        payload: userInfo
    }
}

export const setReferer = (referer) => {
    return {
        type: SET_REFERER,
        payload: referer
    }
}

export const setSettings = (settings : any) => {
    return {
        type: SET_SETTINGS,
        payload: settings
    }
}

export const setSiteInfo = (siteInfo) => {
    return {
        type: SET_SIETINFO,
        payload: siteInfo
    }
}

export const setTabs = (tabs: TabBarItem[]) => {
    return {
        type: SET_TABS,
        payload: tabs
    }
}

export const setPageLoading = (loading: boolean) => {
    return {
        type: SET_PAGELOADING,
        payload: loading
    }
}

export const setContext = (context: Context) : Action => {
    return {
        type: SET_CONTEXT,
        payload: context
    }
}

export const setPosition = (latlng: LatLng) : Action => {
    return {
        type: SET_POSITION,
        payload: latlng
    }
}
export const setGeo = (result) : Action => {
    return {
        type: SET_GEO,
        payload: {
            province: result.address_component.province,
            city: result.address_component.city,
            district: result.address_component.district
        }
    }
}

export const setSite = (site: any) : Action => {
    return {
        type: SET_SITE,
        payload: site
    }
}
