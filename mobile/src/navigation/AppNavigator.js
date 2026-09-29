import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import HomeScreen from "../screens/HomeScreen";
import CompetitionDetailsScreen from "../screens/CompetitionDetailsScreen";
import UploadSubmissionScreen from "../screens/UploadSubmissionScreen";

import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

import MyCompetitionsScreen from "../screens/MyCompetitionsScreen";
import MySubmissionsScreen from "../screens/MySubmissionsScreen";

import UserReviewsScreen from "../screens/UserReviewsScreen";

import { useAuth } from "../context/AuthContext";


// =====================================================
// STACK
// =====================================================

const Stack = createNativeStackNavigator();


// =====================================================
// APP NAVIGATOR
// =====================================================

export default function AppNavigator() {
  const {
    user,
    loading,
  } = useAuth();


  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (loading) {
    return null;
  }


  // =====================================================
  // NAVIGATOR
  // =====================================================

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      {/* =================================================
          AUTHENTICATION SCREENS
      ================================================= */}

      {!user ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
        </>
      ) : (

        /* =================================================
           AUTHENTICATED SCREENS
        ================================================= */

        <>
          {/* =================================================
              HOME
          ================================================= */}

          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />


          {/* =================================================
              COMPETITION DETAILS
          ================================================= */}

          <Stack.Screen
            name="Competition"
            component={CompetitionDetailsScreen}
          />


          {/* =================================================
              UPLOAD SUBMISSION
          ================================================= */}

          <Stack.Screen
            name="UploadSubmission"
            component={UploadSubmissionScreen}
          />


          {/* =================================================
              PROFILE
          ================================================= */}

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />


          {/* =================================================
              EDIT PROFILE
          ================================================= */}

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
          />


          {/* =================================================
              MY COMPETITIONS
          ================================================= */}

          <Stack.Screen
            name="MyCompetitions"
            component={MyCompetitionsScreen}
          />


          {/* =================================================
              MY SUBMISSIONS
          ================================================= */}

          <Stack.Screen
            name="MySubmissions"
            component={MySubmissionsScreen}
          />


          {/* =================================================
              USER REVIEWS
          ================================================= */}

          <Stack.Screen
            name="UserReviews"
            component={UserReviewsScreen}
          />
        </>
      )}

    </Stack.Navigator>
  );
}