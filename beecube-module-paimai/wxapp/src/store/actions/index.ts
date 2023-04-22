import {Context, LatLng} from "../../context";
import {
    SET_CONTEXT, SET_GEO, SET_MESSAGE,
    SET_PAGELOADING, SET_POSITION,
    SET_REFERER,
    SET_SETTINGS,
    SET_SIETINFO, SET_SITE, SET_SYSTEMINFO,
    SET_USERINFO
} from "../constants"


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
export const setSystemInfo = (systemInfo) => {
  return {
    type: SET_SYSTEMINFO,
    payload: systemInfo
  }
}

export const setPageLoading = (loading: boolean) => {
    return {
        type: SET_PAGELOADING,
        payload: loading
    }
}

export const setContext = (context: Context) => {
    return {
        type: SET_CONTEXT,
        payload: context
    }
}

export const setPosition = (latlng: LatLng) => {
    return {
        type: SET_POSITION,
        payload: latlng
    }
}
export const setGeo = (result) => {
    return {
        type: SET_GEO,
        payload: {
            province: result.address_component.province,
            city: result.address_component.city,
            district: result.address_component.district
        }
    }
}

export const setSite = (site: any) => {
    return {
        type: SET_SITE,
        payload: site
    }
}
export const setMessage = (message: any) => {
    return {
        type: SET_MESSAGE,
        payload: message
    }
}
