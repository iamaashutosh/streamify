import React, { useState, useEffect } from "react";
import styles from "../assets/css/user_profile.module.css";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/navbar";
import { get_subsciption_data, get_user_profile, logout } from "../api/endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";

const Profile = () => {

  const stripePromise = loadStripe("pk_test_51RBV91IodBvEuETZxVL4WDRzCEfswk2lgK2imrrWGvDheqyLPv7aWxIyVzcIwNe0fuDgWppLEdM7qKqHQ28VsbGu00WxBJYN5P");
  const {user , logoutUser}= useAuth();
  const [userprofile, setUserProfile] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [plan, setPlan] = useState([]);
    const navigate = useNavigate();

  const fetchUserProfile = async()=>{
    const response = await get_user_profile();
    setUserProfile(response);
  }
  const fetchSubscriptionData = async()=>{
    const response  = await get_subsciption_data();
    setSubscriptionData(response);
    setPlan(response.subscription_type);
  }
  useEffect(() => {
    fetchSubscriptionData();
    fetchUserProfile();
    }, []);
    const handleSubscribe = async () => {
      try {
          // Call your Django backend to create the Checkout Session
          const response = await axios.post('http://127.0.0.1:8000/create-upgrade-checkout-session/');
          
          const stripe = await stripePromise;
          
          // Redirect to Stripe Checkout
          const { error } = await stripe.redirectToCheckout({
              sessionId: response.data.sessionId
          });
          
          if (error) {
              console.error("Stripe Checkout error:", error.message);
          }
      } catch (err) {
          console.error("Error during subscription:", err);
      }
  };
    

  const handleCancelSubscription = async() => {
    try{
        await axios.post("http://127.0.1:8000/cancel_sub/",{withCredentials:true},)
    }
    catch(error){
        console.error("Error canceling subscription:", error);
    }
    alert("Subscription canceled!");
    // Add logic to cancel subscription (API Call)
    window.location.reload();
  };
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className={styles.profileContainer}>
        <Navbar/>
      <div className={styles.profileCard}>
        {/* Profile Image */}
        <img src={userprofile.image} alt="Profile" className={styles.profileImage} />
        
        {/* User Info */}
        <h2>{user.first_name}</h2>
        <p>{user.email}</p>

        {/* Subscription Details */}
        <div className={styles.subscription}>
          <p><strong>Subscription:</strong> {plan}</p>
          <p><strong>Expires On:</strong>{new Date(subscriptionData.end_date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            })}</p>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
            {plan ==="Free" || plan ==="None" ?(
          <button className={styles.extendBtn} onClick={handleSubscribe}>
            Upgrade Subscription
          </button>
            ):(
          <button className={styles.cancelBtn} onClick={handleCancelSubscription}>
            Cancel Subscription
          </button>
          )}
          <button className={styles.cancelBtn} onClick={handleLogout}>Logout</button>
          <a className={styles.edit_btn} href="/edit_profile"><FaEdit/><p>Edit</p></a>
          </div>
        </div>
      </div>
  );
};

export default Profile;
