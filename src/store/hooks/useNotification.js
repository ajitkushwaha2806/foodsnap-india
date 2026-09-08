import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, removeNotification, clearNotifications } from "@/store/slice/notificationSlice";

export const useNotification = () => {
    const dispatch = useDispatch();
    const { notifications = [] } = useSelector((state) => state.notifications || {});

    const notify = useCallback(
        (type, message, duration = 4000, options = {}) => {
            dispatch(
                addNotification({
                    type,
                    message,
                    duration,
                    ...options,
                })
            );
        },
        [dispatch]
    );

    const handleRemove = useCallback(
        (id) => {
            dispatch(removeNotification(id));
        },
        [dispatch]
    );

    const handleClear = useCallback(() => {
        dispatch(clearNotifications());
    }, [dispatch]);

    return {
        notifications,
        activeNotification: notifications[0] || null,
        notify,
        success: (msg, duration, options) => notify("success", msg, duration, options),
        error: (msg, duration, options) => notify("error", msg, duration, options),
        warning: (msg, duration, options) => notify("warning", msg, duration, options),
        info: (msg, duration, options) => notify("info", msg, duration, options),
        custom: (options) => dispatch(addNotification(options)),
        removeNotification: handleRemove,
        clearNotifications: handleClear,
    };
};

export default useNotification;
