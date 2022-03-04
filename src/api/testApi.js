import axiosClient from './axiosClient';
const testApi={
    login:function(body){
        const url ='/login';
        return axiosClient.post(url,body);
    },
    api:function(params){
        const url ='/api';
        return axiosClient.get(url,{
            body:params,
            baseURL: 'http://localhost:4000'
        });
    },
    token: function(body){
        const url ='/token';
        return axiosClient.post(url,body);
    },
    logout: function(){
        const url ='/logout';
        return axiosClient.delete(url);
    }
}
export default testApi;