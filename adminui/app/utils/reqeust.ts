
export const BASE_URL = 'http://localhost:9999';
export const API_LOGIN = `${BASE_URL}/jeecg-system/sys/login`;


export const postFormInit = (data: FormData): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}