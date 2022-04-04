import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, LogoTitle, Image } from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";
import {MaterialCommunityIcons} from "react-native-vector-icons";

import AboutScreen from "../Pages/AboutScreen";
import OrderScreen from "../Pages/OrderScreen";
import HomeScreen from "../Pages/HomeScreen";
import LoginScreen from "../Pages/LoginScreen";
import ProductScreen from "../Pages/ProductScreen";
import LogoutScreen from "../Pages/LogoutScreen";
import ProdukDetail from "../Pages/ProdukDetail";
import KategoriDetail from "../Pages/KategoriDetail";
import LoadScreen from "../Pages/LoadScreen";
import MKategori from "../Pages/MKategori";
import MProduk from "../Pages/MProduk";
import MProdukAdd from "../Pages/MProdukAdd";
import RegistrasiScreen from "../Pages/RegistrasiScreen";

import { useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "react-native-gesture-handler";

import { useDispatch } from "react-redux";
import { setSignInStatus } from "../Redux/authSlice";


/*
import Splash from "../Pages/SplashScreen";
import SplashScreen2 from "../Pages/SplashScreen2";
*/

const Tab = createBottomTabNavigator();
const Drawwer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function Router() {
	const dispatch = useDispatch();

	const isSignedIn = useSelector((state) => state.auth.isSignIn);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				
				const uid = user.uid;
				dispatch(setSignInStatus(true));
				
				
			} else {
				
				dispatch(setSignInStatus(false));

				
			}
		});

		return unsubscribe;
	}, []);


	function LogoTitle() {
		return (
			<>
			<View style={{flexDirection:"row", margin:0,}}>
				<Image
					style={{ width: 50, height: 50, borderRadius:10, }}
					source={require('../assets/logo_awalRGS.png')}
				/>
				<Text style={{marginLeft:10, fontWeight:"bold", fontSize:22, marginTop:5,}}>Real Gaming Store</Text>	
			</View>
				
			</>
		  
		);
	  }

	return (
		<NavigationContainer >
			<Stack.Navigator initialRouteName="LoginScreen" screenOptions={{
				headerShown:false,
				headerStyle: {
					backgroundColor: '#6872EB',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontSize:14,
				},
			}} 
	  	>			

			{!isSignedIn ? (
				<>
				<Stack.Screen name="LoginScreen" component={LoginScreen}  options={{ headerTitle: (props) => <LogoTitle {...props} /> }}  />
				<Stack.Screen name="RegistrasiScreen" component={RegistrasiScreen} options={{headerShown:false, headerTitle:'Registrasi Akun',}} />
				</>
			) : (
				<>
				<Stack.Screen name="LoginScreen" component={LoginScreen}  options={{ headerTitle: (props) => <LogoTitle {...props} /> }}  />
				<Stack.Screen name="HomeScreen" component={HomeScreen} />											
				<Stack.Screen name="MainApp" component={MainApp} />
				<Stack.Screen name="LoadScreen" component={LoadScreen} options={{headerShown:false,}} />
				<Stack.Screen name="ProdukDetail" component={ProdukDetail} options={{headerShown:true, headerTitle:'Detail Produk',}} />
				<Stack.Screen name="KategoriDetail" component={KategoriDetail} options={{headerShown:true, headerTitle:'Detail Kategori',}} />
				<Stack.Screen name="MKategori" component={MKategori} options={{headerShown:false, headerTitle:'Daftar Kategori',}} />
				<Stack.Screen name="MProduk" component={MProduk} options={{headerShown:false, headerTitle:'Daftar Produk',}}/>
				<Stack.Screen name="MProdukAdd" component={MProdukAdd} options={{headerShown:false, headerTitle:'Setting Produk',}} />
				<Stack.Screen name="RegistrasiScreen" component={RegistrasiScreen} options={{headerShown:false, headerTitle:'Registrasi Akun',}} />

				{/*<Stack.Screen name="MyDrawwer" component={MyDrawwer}  />*/}
				</>
			)}	
				

			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({});

const MyDrawwer = ({ route }) => {
	const { itemId, otherParam } = route.params;
	//console.log("itemId",itemId);
	return (
	<Drawwer.Navigator screenOptions={{
		headerShown:false,
	}} >
		<Drawwer.Screen name="Menu" component={MainApp} style={{color:'black'}} options={{
				headerTintColor: '#000',
				headerRight: () => 
				{
				return (
					<View style={{flexDirection:"row"}}>
					
					
					<MaterialCommunityIcons
					name="home"
					color="red"
					size={30}
					onPress={() => alert('This is a button!')}
					/>

					<MaterialCommunityIcons
					name="arrow-right-bold-circle"
					color="red"
					size={30}
					onPress={() => alert('This is a button!')}
					/>
					
					</View>
				)},
				}} />
		<Drawwer.Screen name="AboutScreen" component={AboutScreen}/>
	</Drawwer.Navigator>
	);
};


const MainApp = () => (
		<Tab.Navigator initialRouteName="Home"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
				const icons = {
					"Home": 'home',
					"Order": 'basket',
					"Product": 'laptop',
					"My Profile": 'account',
					"Logout": 'logout',
				};
		
				return (
					<MaterialCommunityIcons
					name={icons[route.name]}
					color={color}
					size={size}
					/>
				);
				},
				headerShown:false,
			})}

		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Order" component={OrderScreen}/>						
			<Tab.Screen name="Product" component={ProductScreen}/>
			<Tab.Screen name="My Profile" component={AboutScreen}/>
			<Tab.Screen name="Logout" component={LogoutScreen}/>

		</Tab.Navigator>
);



