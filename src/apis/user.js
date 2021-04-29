import axios from "@/utils/request.js"


// 登录
export const userLogin = (data) => {
    return axios({
        method: 'post',
        url: '/login',
        data
    })
}