import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";

export default function AboutScreen({ route, navigation }) {

 

    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      };
    const updateHarga =(price)=>{
        console.log("UpdatPrice : " + price);
        
    }

    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Image
                     style={{ resizeMode:'stretch', height:100, width:'100%', }}
                    source={require('../assets/header2.png')}
                />
                
            </View>
                           

            <View style={{ backgroundColor:'#82A7F4', height:30, width:'100%', color:'white',}}>
                <TouchableOpacity style={{flexDirection:'row'}}>                    
                    <MaterialCommunityIcons style={{padding:5,}}
                            name="account-tie"
                            color="white"
                            size={20}
                        />
                    <Text style={{padding:5, paddingLeft:0, paddingTop:7, color:'white',fontSize:12, fontWeight:'bold',}}>My Profiles</Text>                   
                </TouchableOpacity>                    
            </View>

            <View style={{width:'100%', padding:10, flex:1, height:'100%',}}>

                <View style={{padding:5, flexDirection:'row', height:120,}}>
                    <Image
                        style={{ resizeMode:'contain', height:100, width:100, borderRadius:100, }}
                        source={require('..//assets/PP2.png')}
                    />
                    <View style={{paddingLeft:10,justifyContent:'center', height:'100%'}}>
                        <Text style={{fontWeight:'bold', fontSize:16,}}>Hendra Risnawan</Text>
                        <Text style={{fontSize:12, color:'blue'}}>React Native</Text>
                    </View>
                </View>

                <View style={{padding:5, borderStyle:'solid', borderTopWidth:0.3, borderColor:'blue'}}>                   
                </View>

                <View style={{flexDirection:'row', marginTop:5}}>
                    <MaterialCommunityIcons
                            name="linkedin"
                            color="black"
                            size={24}
                        />
                        <Text style={{marginLeft:5}}>@hendraRwn</Text>
                </View>
                <View style={{flexDirection:'row', marginTop:5}}>
                    <MaterialCommunityIcons
                            name="facebook"
                            color="black"
                            size={24}
                        />
                        <Text style={{marginLeft:5}}>Hendra Risnawan</Text>
                </View>
                <View style={{flexDirection:'row', marginTop:5}}>
                    <MaterialCommunityIcons
                            name="email-outline"
                            color="black"
                            size={24}
                        />
                        <Text style={{marginLeft:5}}>hendra.risnawan15@gmail.com</Text>
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

