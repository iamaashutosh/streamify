import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');
        
        if (sessionId) {
            const verifySubscription = async () => {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/subscription-success/?session_id=${sessionId}`,
                        {
                            headers: {
                                'Authorization': `Token ${user.token}`
                            }
                        }
                    );
                    setSubscriptionData(response.data);
                } catch (err) {
                    setError(err.response?.data?.error || 'Failed to verify subscription');
                } finally {
                    setLoading(false);
                }
            };
            
            verifySubscription();
        } else {
            setError('No session ID found');
            setLoading(false);
        }
    }, [location, user, navigate]);
    
    if (loading) return <div>Verifying your subscription...</div>;
    if (error) return <div className="error">{error}</div>;
    
    return (
        <div className="success-container">
            <h2>Subscription Successful!</h2>
            <p>Thank you for subscribing to our service.</p>
            {subscriptionData && (
                <div className="subscription-details">
                    <p>Email: {subscriptionData.customer_email}</p>
                    <p>Plan: {subscriptionData.plan_name}</p>
                    <p>Subscription valid until: {new Date(subscriptionData.end_date).toLocaleDateString()}</p>
                    <a 
                    href="/profile" 
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        border: 'none',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                    >
                    Return to Profile
                    </a>
                </div>
            )}
        </div>
    );
};

export default Success;