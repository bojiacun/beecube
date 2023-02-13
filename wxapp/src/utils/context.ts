import {Context} from "../types/context";

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

export const currentContext = () => {
    return context;
}

export default context;
