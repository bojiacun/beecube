import request, {SERVICE_WINKT_MEMBER_HEADER} from "../../utils/request";

export async function registerMember(data:any, userInfo: any) {
    return request.put("wxapp/member/register", SERVICE_WINKT_MEMBER_HEADER, data, userInfo.token).then(res=>{
        return res.data.data;
    });
}
export async function registerSiteMember(data:any, userInfo: any) {
    return request.put("wxapp/member/register_site", SERVICE_WINKT_MEMBER_HEADER, data, userInfo.token).then(res=>{
        return res.data.data;
    });
}
export async function memberLogin(data:any) {
    return request.put("wxapp/member/login", SERVICE_WINKT_MEMBER_HEADER, data, false).then(res=>{
        return res.data.data;
    });
}
