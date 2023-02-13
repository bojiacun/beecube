import {SiteInfo} from "./siteinfo";


export declare interface  UserInfo {
    sessionid: string,
    openid: string,
    unionid: string,
    memberInfo: any
}

export declare interface LatLng {
    lat: number,
    lng: number
}

export declare interface Context {
    settings: any,
    siteInfo: SiteInfo | null,
    referer: object | null,
    userInfo: UserInfo | null,
    systemInfo: any,
    navBarHeight: number,
    position: LatLng | null,
    province?: string;
    provinceId?: string;
    city?: string;
    cityId?: string;
    district?: string;
    districtId?: string;
    headerHeight?: number;
}
