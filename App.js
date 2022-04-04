
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import SplashScreen2 from "./app/index";

import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { useState } from "react";
import { getApps, initializeApp } from "firebase/app";

import { Provider } from "react-redux";
import { store } from "./app/Redux/store";

const firebaseConfig = {
  apiKey: "AIzaSyBxQKzuFEGQrHNzq_0Zqhu_pZn2y25r3Bc",
  authDomain: "authenticationrgs.firebaseapp.com",
  projectId: "authenticationrgs",
  storageBucket: "authenticationrgs.appspot.com",
  messagingSenderId: "605052195196",
  appId: "1:605052195196:web:2c8cba20207caf863a54f9"
};
  

// Initialize 
if (!getApps().length) {
	const app = initializeApp(firebaseConfig);
}


export default function App(){
    return (
        <Provider store={store}>
			<StatusBar style="light" translucent={false} />
			
			<SplashScreen2 />

		</Provider>
    );
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
})


