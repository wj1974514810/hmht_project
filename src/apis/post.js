import axios from "@/utils/request.js"

export const getPostList = (params) => {
    return axios({
        url: '/post',
        params

    })
}