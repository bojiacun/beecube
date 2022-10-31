
export const BASE_URL = 'http://localhost:8080';
export const API_LOGIN = `${BASE_URL}/login`;


export const postFormInit = (data: FormData): RequestInit=> {
    return {method: 'post', body: data, headers: {'Content-Type': 'application/json'}};
}