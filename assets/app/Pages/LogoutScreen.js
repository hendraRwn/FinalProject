import React, { useCallback, useEffect }  from 'react'
import { useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";


export default function LogoutScreen({ route, navigation }) {
    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Image
                    style={{ resizeMode:'stretch', height:100, width:'100%', }}
                    source={require('../assets/header2.png')}
                />
                
            </View>
                           

            <View style={{ backgroundColor:'#82A7F4', height:30, width:'100%', color:'white',}}>
                             
            </View>
           
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Anda yakin ingin logut dari sistem ini ?</Text>
                <View style={{flexDirection:'row', marginTop:10,}}>
                    <TouchableOpacity style={{padding:5, margin:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#404578', borderRadius:10, width:65}} 
                        onPress={() => {
							const auth = getAuth();
							signOut(auth);
                            navigation.navigate("MainApp");
						}}
                    >
                        <MaterialCommunityIcons
                                name="check-circle-outline"
                                color="white"
                                size={14}
                            />    
                        <Text style={{fontSize:11, color:'white',}}> Ya</Text>
                            
                    </TouchableOpacity>  

                    <TouchableOpacity style={{padding:5, margin:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#FF4B34', borderRadius:10, width:65}} 
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons
                                name="close-circle-outline"
                                color="white"
                                size={14}
                            />    
                        <Text style={{fontSize:11, color:'white',}}> Tidak</Text>
                            
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

