import { useEffect } from "react";
import api from "../../api/axios";

import useAppDispatch from "../../hooks/useAppDispatch";

import {
    restoreUser,
    authFinished,
} from "../../features/auth/authSlice";
import { clearWishlist, loadWishlist } from "../../features/wishlist/wishlistSlice";

const AuthInitializer = ({ children }) => {

    const dispatch = useAppDispatch();

    useEffect(() => {

        const initializeAuth = async () => {

            try {

                const response = await api.get("/users/current-user");

                dispatch(
                    restoreUser({
                        user: response.data.data,
                    })
                );

                dispatch(loadWishlist());

            } catch (error) {

                dispatch(clearWishlist());
                dispatch(authFinished());

            }

        };

        initializeAuth();

    }, [dispatch]);

    return children;
};

export default AuthInitializer;