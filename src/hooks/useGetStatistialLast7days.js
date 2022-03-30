import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
function useStatisticalLast7days() {
    const navigate = useNavigate();
    const [statistical, setStatistical] = useState([]);
    const [loading, setLoading] = useState(true);
    const getStatistical = () => {
        FormApi.statisticalLast7days().then((statisticalRes) => {
            setStatistical(statisticalRes);
            setLoading(false)
        })
        .catch((error) => {
            FormApi.token({ refreshToken: localStorage.getItem('refreshToken') })
            .then((res) => {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                FormApi.statisticalLast7days().then((statisticalRes) => {
                    setStatistical(statisticalRes);
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    navigate('/login');
                });
            })
            .catch((error) => {
                console.log(error);
                navigate('/login');
            });
        });
    };
    useEffect(() => {
        getStatistical();
    }, []);
    return [loading, statistical];
}
export default useStatisticalLast7days;