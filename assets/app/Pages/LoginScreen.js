import React, { useState } from "react";
import { Button, StyleSheet, Text, View, TextInput, Image, Alert, } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";
import {MaterialCommunityIcons} from "react-native-vector-icons";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setSignInStatus, logIn } from "../Redux/authSlice";


export default function Login({navigation}) {
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);

    const isSignedIn = useSelector((state) => state.auth.isSignIn);

    const submit = () => {
		if (!username){
            alert('Isikan email terlebih dahulu');
            return false;
        }
        if (!password){
            alert('Isikan password terlebih dahulu');
            return false;
        }

		const auth = getAuth();

		signInWithEmailAndPassword(auth, username, password)
			.then((userCredential) => {
				
				const user = userCredential.user;				
                const dataLogin = {
                    userName: user.displayName,
	                userEmail: user.email,
	                userId: user.uid,
                }
                dispatch(logIn(dataLogin));
                dispatch(setSignInStatus(true));				
                navigation.navigate("MainApp")
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
                dispatch(setSignInStatus(false));
                Alert.alert(errorMessage);
			});
	};

    return (

        <View style={styles.container}>
            <View style={{flexDirection:"row", backgroundColor:'#000000', position:'absolute', left:0, right:0, top:0, padding:5,}}>
				<Image
					style={{ resizeMode:'stretch', height:100, width:'100%', }}
                    source={require('../assets/header2.png')}
				/>
					
			</View>

            <View style={{marginTop:50, alignItems:'center', justifyContent:'center', flex:4,}}>
                <Text style={{ fontSize: 26, fontWeight: "bold", color:"#404578", marginBottom:30, marginTop:50, }}>Login</Text>                    
                
                <View style={{ alignItems:'flex-start'}}>
                <Text>Email</Text>
                <TextInput
                    style={{
                    borderWidth: 0.2,
                    borderColor:'#404578',
                    paddingVertical: 5,
                    borderRadius: 2,
                    width: 280,
                    marginBottom: 10,
                    paddingHorizontal: 5,
                    }}
                    placeholder=""
                    value={username}
                    onChangeText={(value)=>setUsername(value)}
                />   
                </View>

                <View style={{ alignItems:'flex-start'}}>
                <Text style={{color:'black'}}>Password</Text>
                <TextInput 
                    style={{
                    borderWidth: 0.2,
                    borderColor:'#404578',
                    paddingVertical: 5,
                    borderRadius: 2,
                    width: 280,
                    marginBottom: 10,
                    paddingHorizontal: 5,
                    }}
                    placeholder=""
                    value={password}
                    secureTextEntry
                    onChangeText={(value)=>setPassword(value)}
                />
                </View>

                <TouchableOpacity style={{ marginTop:20, borderRadius:30, padding:5, paddingLeft:15, paddingRight:15, backgroundColor:'#404578',
                 alignItems:'center', flexDirection:'row',}}
                    onPress={submit}                    
                >
                    <Text style={{color:'white'}}>Masuk App </Text>
                    <MaterialCommunityIcons
                            name="location-enter"
                            color="white"
                            size={18}                         
                            />
                    
                </TouchableOpacity>                                            
          
            </View>           
            

           
            <View style={{flex:1, flexDirection:'row'}}>
                <Text>Belum punya akun ? </Text>
                <TouchableOpacity onPress={()=>navigation.navigate("RegistrasiScreen",{
                        itemId: 86,
                    }
                    )} >
                    <Text style={{fontWeight:'bold', color:'#6872EB'}}>Daftar Akun</Text>
                </TouchableOpacity>    
                    
            </View>

        </View>

        

    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center',
     
    }
})
