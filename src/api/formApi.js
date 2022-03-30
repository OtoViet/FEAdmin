import axiosClient from './axiosClient';
const formApi={
    createEmployeeAccount:function(body){
        const url ='/admin/createEmployeeAccount';
        return axiosClient.post(url,body);
    },
    existAccount:function(body){
        const url ='/auth/checkExistAccount';
        return axiosClient.post(url,body);
    },
    checkPassword: function(body){
        const url ='/auth/checkPassword';
        return axiosClient.post(url,body);
    },
    login:function(body){
        const url ='/admin/login';
        return axiosClient.post(url,body);
    },
    loginGoogle:function(body){
        const url ='/auth/loginGoogle';
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
        const url ='/auth/token';
        return axiosClient.post(url,body);
    },
    logout: function(){
        const url ='/auth/logout';
        return axiosClient.delete(url);
    },
    forgotPassword: function(body){
        const url ='/auth/forgotPassword';
        return axiosClient.patch(url,body);
    },
    checkTokenResetPassword: function(body){
        const url ='/auth/checkTokenResetPassword';
        return axiosClient.post(url,body);
    },
    resetPassword: function(body){
        const url ='/auth/resetPassword';
        return axiosClient.post(url,body);
    },
    changePassword: function(body){
        const url ='/auth/changePassword';
        return axiosClient.patch(url,body);
    },
    checkAdmin: function(body){
        const url ='/admin/checkAdmin';
        return axiosClient.post(url,body);
    },
    getAllEmployee: function(){
        const url ='/admin/getAllEmployee';
        return axiosClient.get(url);
    },
    deleteEmployee: function(id){
        const url ='/admin/deleteEmployee/'+id;
        return axiosClient.delete(url);
    },
    updateInfoEmployee: function(body,id){
        const url ='/admin/updateInfoEmployee/'+id;
        return axiosClient.patch(url,body);
    },
    getEmployee: function(id){
        const url ='/admin/getEmployee/'+id;
        return axiosClient.get(url);
    },
    addNewProduct: function(body){
        const url ='/admin/addNewProduct';
        return axiosClient.post(url,body);
    },
    getAllProduct: function(){
        const url ='/admin/getAllProduct';
        return axiosClient.get(url);
    },
    updateProduct: function(body,id){
        const url ='/admin/updateProduct/'+id;
        return axiosClient.patch(url,body);
    },
    deleteProduct: function(id){
        const url ='/admin/deleteProduct/'+id;
        return axiosClient.delete(url);
    },
    createStore: function(body){
        const url ='/admin/createStore';
        return axiosClient.post(url,body);
    },
    getAllStore: function(){
        const url ='/admin/getAllStore';
        return axiosClient.get(url);
    },
    updateStore: function(body,id){
        const url ='/admin/updateStore/'+id;
        return axiosClient.patch(url,body);
    },
    deleteStore: function(id){
        const url ='/admin/deleteStore/'+id;
        return axiosClient.delete(url);
    },
    statistical: function(){
        const url ='/admin/statistical';
        return axiosClient.get(url);
    },
    statisticalLast7days: function(){
        const url ='/admin/statisticalLast7days';
        return axiosClient.get(url);
    },
    getAllOrder: function(){
        const url ='/admin/getAllOrder';
        return axiosClient.get(url);
    },
    createDiscount: function(body){
        const url ='/admin/createDiscount';
        return axiosClient.post(url,body);
    },
    getAllDiscount: function(){
        const url ='/admin/getAllDiscount';
        return axiosClient.get(url);
    },
    updateDiscount: function(body,id){
        const url ='/admin/updateDiscount/'+id;
        return axiosClient.patch(url,body);
    },
    deleteDiscount: function(id){
        const url ='/admin/deleteDiscount/'+id;
        return axiosClient.delete(url);
    },
}
export default formApi;