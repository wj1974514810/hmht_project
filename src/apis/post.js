import axios from "@/utils/request.js"

export const getPostList = (params) => {
    return axios({
        url: '/post',
        params
    })
}


// 文章发布
export const publishPost = (data) => {
    return axios({
        method: 'post',
        url: '/post',
        data
    })
}