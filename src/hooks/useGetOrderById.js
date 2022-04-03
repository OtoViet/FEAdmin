import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
function useGetOrderById(id) {
    const [order, setOrder] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const getOrderById = () => {
        FormApi.getOrderById(id).then((order) => {
            setOrder(order);
            setLoading(false);
        })
            .catch((error) => {
                FormApi.token({ refreshToken: localStorage.getItem('refreshToken') }).then((res) => {
                    localStorage.setItem('token', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                    FormApi.getOrderById(id).then((order) => {
                        setOrder(order);
                        setLoading(false)
                    })
                        .catch((error) => {
                            navigate('/');
                            console.log(error);
                        });
                })
                    .catch((error) => {
                        navigate('/');
                        console.log(error);
                    });
            });
    };
    useEffect(() => {
        getOrderById();
    }, []);
    return [loading, order];
}
export default useGetOrderById;