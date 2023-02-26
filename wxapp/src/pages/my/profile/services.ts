import request from "../../../lib/request";


export const saveUserInfo = (userInfo:any) => {
    return request.put('/app/api/members/update', userInfo);
}
