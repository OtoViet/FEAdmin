import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';

function useGetAllDiscount() {
    const [discount, setDiscount] = useState([]);
    const [loading, setLoading] = useState(true);
    const getListDiscount = () => {
        FormApi.getAllDiscount().then((discountRes) => {
            setDiscount(discountRes);
            setLoading(false)
        })
        .catch((error) => {
            FormApi.token({ refreshToken: localStorage.getItem('refreshToken') }).then((res) => {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                FormApi.getAllDiscount().then((discountRes) => {
                    setDiscount(discountRes);
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
        getListDiscount();
    }, []);
    return [loading, discount];
}
export default useGetAllDiscount;