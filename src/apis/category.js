import axios from "@/utils/request.js"

export const getCateList = () => {
    return axios({
        url: '/category',


    })
}