import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';

function useGetAllOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const getListOrders = () => {
        FormApi.getAllOrder().then((orders) => {
            setOrders(orders);
            setLoading(false)
        })
            .catch((error) => {
                FormApi.token({ refreshToken: localStorage.getItem('refreshToken') }).then((res) => {
                    localStorage.setItem('token', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                    FormApi.getAllOrder().then((orders) => {
                        setOrders(orders);
                        setLoading(false)
                    })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    };
    useEffect(() => {
        getListOrders();
    }, []);
    return [loading, orders];
}
export default useGetAllOrders;