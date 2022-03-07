import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';

function useGetEmployee(id) {
    const [employee, setEmployee] = useState([]);
    const [loading, setLoading] = useState(true);
    const getEmployee = () => {
        FormApi.getEmployee(id).then((employee) => {
            setEmployee(employee);
            setLoading(false)
        })
            .catch((error) => {
                FormApi.token({ refreshToken: localStorage.getItem('refreshToken') }).then((res) => {
                    localStorage.setItem('token', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                    FormApi.getEmployee(id).then((employee) => {
                        setEmployee(employee);
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
        getEmployee();
    }, []);
    return [loading, employee];
}
export default useGetEmployee;