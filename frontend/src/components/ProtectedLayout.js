import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderMenu from './HeaderMenu';

const ProtectedLayout = () => {
    return (
        <div>
            <HeaderMenu />
            <Outlet />
        </div>
    );
};

export default ProtectedLayout;
