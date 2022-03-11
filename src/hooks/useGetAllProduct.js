import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';

function useGetAllProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const getListProduct = () => {
        FormApi.getAllProduct().then((productsRes) => {
            setProducts(productsRes);
            setLoading(false)
        })
        .catch((error) => {
            FormApi.token({ refreshToken: localStorage.getItem('refreshToken') })
            .then((res) => {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                FormApi.getAllProduct().then((productsRes) => {
                    setProducts(productsRes);
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
        getListProduct();
    }, []);
    return [loading, products];
}
export default useGetAllProduct;