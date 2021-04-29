import axios from "@/utils/request.js"


export const userLogin = (data) => {
    return axios({
        method: 'post',
        url: '/login',
        data
    })
}