import React from 'react';
import UserProfileDashboard from '@/components/user-profile-dashboard';
import apiService from '@/services/apiService';

export default async function Auth() {

    return (
        <div>
            <UserProfileDashboard />
        </div>
    );
}