import FormApi from '../api/formApi.js';
import { useState, useEffect } from 'react';

function useGetAllNotification(idOrder) {
    const [notification, setNotification] = useState();
    const [loading, setLoading] = useState(true);
    const getListNotification = () => {
        FormApi.getNotificationByOrderId(idOrder).then((notification) => {
            setNotification(notification);
            setLoading(false)
        })
        .catch((error) => {
            FormApi.token({ refreshToken: localStorage.getItem('refreshToken') }).then((res) => {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                FormApi.getNotificationByOrderId(idOrder).then((notification) => {
                    setNotification(notification);
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
        getListNotification();
    }, []);
    return [loading, notification];
}
export default useGetAllNotification;