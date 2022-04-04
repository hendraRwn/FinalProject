import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logIn } from "../Redux/authSlice";

import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
	collection,
	addDoc,
	getFirestore,
	getDoc,
	getDocs,
	query,
	where,
    Timestamp,
    orderBy, 
    doc, updateDoc, deleteDoc,
} from "firebase/firestore";



export default function RegistrasiScreen({ route, navigation }) {

    const dipatch = useDispatch();

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [konfirmasi, setKonfirmasi] = useState("");
    const [isError, setIsError] = useState(false);


    const [openAddModal, setOpenAddModal] = useState(false)
    const [tasks, setTasks] = useState([])

    
    const submit = () => {
		if (!nama){
            alert("Isikan nama user terlebih dahulu")
            return false;
        }else if (!email){
            alert("Isikan email terlebih dahulu")
            return false;
        }else if (!password){
            alert("Isikan password terlebih dahulu")
            return false;
        }else if (!konfirmasi){
            alert("Isikan konfirmasi password terlebih dahulu")
            return false;        
        }

        if (password !== konfirmasi){
            alert("Konfirmasi password tidak sesuai");
            return false;
        }

        const auth = getAuth();        		
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				
                updateProfile(userCredential.user,{
                    displayName: nama
                })
                                
				const userid = userCredential.user.uid;    
				dipatch(
					logIn({
						token: password,
						email: email,
					}),
				);                                
                simpanData(userid);
                
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
                alert(errorMessage);
			});           
	};

    const simpanData = async (userid) => {		
        try {
			const db = getFirestore();
			const docRef = await addDoc(collection(db, "user"), {
                userid: userid,
                namauser: nama,
                email: email,
                created: Timestamp.now(),
			});	
            alert("Registrasi sukses, silahkan login ke aplikasi");
            navigation.navigate("LoginScreen");	
		} catch (e) {
            alert("gagal simpan ke db "+ e);
		}
	};

    const viewData = async () =>{        
            const db = getFirestore();
            const q = query(collection(db, 'user'), orderBy('email', 'desc'))
            const querySnapshot = await getDocs(q);
                            
                setTasks(querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))            
           
       
            tasks.map((task) => {
                console.log("email : ",task.data.email)
                console.log("password : ",task.data.password)
            });
    };

    const editData = async () => {
    
        let id = "2c8cba20207caf863a54f9";
        
        try{
            const db = getFirestore();
            const taskDocRef = doc(db, 'user', id)
          await updateDoc(taskDocRef, {
            email: "baru",
            password: "ganti",
            user_id:"xxx"
          })
         
        } catch (err) {
          alert(err)
        }    
    }

    const hapusData = async () => {
    
        let id = "2c8cba20207caf863a54f9";
        
        try{
            const db = getFirestore();
            const taskDocRef = doc(db, 'user', id)
          await deleteDoc(taskDocRef);
         
        } catch (err) {
         
        }    
    }

    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Image
                    style={{ resizeMode:'stretch', height:80, width:'100%', }}
                    source={require('../assets/header2.png')}
                />
                
            </View>
                           

            <View style={{ backgroundColor:'#404578', height:30, width:'100%', color:'white',}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>navigation.goBack()} >                    
                    <MaterialCommunityIcons style={{padding:5,}}
                            name="arrow-left-circle-outline"
                            color="white"
                            size={20}
                        />
                    <Text style={{padding:5, paddingLeft:0, paddingTop:7, color:'white',fontSize:12, fontWeight:'bold',}}>Registrasi Akun</Text>                   
                </TouchableOpacity>                    
            </View>
            
            <View style={{padding:15, alignItems:'center'}}>
                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Nama User</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#404578',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        value={nama}
					    onChangeText={(value) => setNama(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Email</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#404578',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        value={email}
					    onChangeText={(value) => setEmail(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Password</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#404578',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        secureTextEntry
                        value={password}
					    onChangeText={(value) => setPassword(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Konfirmasi Password</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#404578',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        secureTextEntry
                        value={konfirmasi}
					    onChangeText={(value) => setKonfirmasi(value)}
                    />   
                </View>

                
                    <View style={{flexDirection:'row',}}>
                        <TouchableOpacity style={{padding:5, margin:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#404578', borderRadius:10, width:85}} 
                            onPress={submit}
                        >
                            <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    color="white"
                                    size={14}
                                />    
                            <Text style={{fontSize:11, color:'white',}}> Simpan</Text>
                                
                        </TouchableOpacity> 

                        <TouchableOpacity style={{padding:5, margin:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#FF4B34', borderRadius:10, width:85}} 
                                                onPress={() => navigation.goBack()}
                        >
                            <MaterialCommunityIcons
                                    name="close-circle-outline"
                                    color="white"
                                    size={14}
                                />    
                            <Text style={{fontSize:11, color:'white',}}> Batal</Text>
                                
                        </TouchableOpacity>  
                    </View>

                
                                                               
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems:'center',
        backgroundColor:'white',
        
    },
    content:{
        width: 150,
        height: 220,        
        margin: 5,
        borderWidth:1,
        alignItems:'center',
        borderRadius: 5,
        borderColor:'grey',    
    },
    rowItem: {
        width:'100%', 
        margin:0, 
        padding:6, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2,
        flexDirection:'row',          
    },
})