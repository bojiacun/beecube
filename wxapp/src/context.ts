export interface SiteInfo {
  name: string;
  appid: string;
  version: string;
  siteroot: string;
  design_method: string;
  token: string | null;
}

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

const context: Context = {
  referer: {},
  settings: {},
  siteInfo: null,
  systemInfo: {},
  userInfo: null,
  navBarHeight: 44,
  position: null,
  province: undefined,
  provinceId: undefined,
  city: undefined,
  cityId: undefined,
  district: undefined,
  districtId: undefined,
}

export default context;
