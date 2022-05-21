import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';
function useGetProductById(id) {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const getProduct = () => {
        FormApi.getProductById(id).then((productRes) => {
            setProduct(productRes);
            setLoading(false)
        })
        .catch((error) => {
            console.log(error);
        });
    };
    useEffect(() => {
        getProduct();
    }, []);
    return [loading, product];
}
export default useGetProductById;