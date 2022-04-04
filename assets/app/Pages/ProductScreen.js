import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";

export default function ProdukScreen({ route, navigation }) {

   
    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      };
    const updateHarga =(price)=>{
        console.log("UpdatPrice : " + price);
        
    }

    return (
        <View style={styles.container}>
                <Image
                     style={{ resizeMode:'stretch', height:100, width:'100%', }}
                    source={require('../assets/header2.png')}
                />

               

                <View style={{ backgroundColor:'#82A7F4', height:30, width:'100%', flexDirection:'row',}}>
                    <MaterialCommunityIcons style={{padding:5,}}
                            name="laptop"
                            color="white"
                            size={20}
                        />
                    <Text style={{padding:5, paddingLeft:0, paddingTop:7, color:'white', fontSize:12, fontWeight:'bold',}}>Setting Produk Saya</Text>                   
                </View>

                <View style={{ flex:1, width:'100%', alignContent:'flex-start'}}>       
                    
                

                            <View style={[styles.rowItem ]} >                                                                        
                                <Image
                                    style={{ height: 30, width: 30, resizeMode:'cover', }}
                                    source={require('../assets/product1.jpg')}
                                />
                                <View style={{marginLeft:10, }}>
                                    <Text style={{fontSize:14, padding:2,}}>Daftar Kategori</Text>                                    
                                </View>                               
                                  
                                <View style={{position:'absolute', right:8, margin:15,}} >
                                    <TouchableOpacity 
                                        onPress={() => navigation.navigate("MKategori")}
                                    >
                                        <MaterialCommunityIcons
                                            name="eslint"
                                            color="black"
                                            size={24}
                                        />
                                        
                                    </TouchableOpacity>                                        
                                   
                                </View>

                            </View>

                            <View style={[styles.rowItem ]} >                                                                        
                                <Image
                                    style={{ height: 30, width: 30, resizeMode:'cover', }}
                                    source={require('../assets/product1.jpg')}
                                />
                                <View style={{marginLeft:10, }}>
                                    <Text style={{fontSize:14, padding:2,}}>Daftar Produk</Text>                                    
                                </View>                               
                                  
                                <View style={{position:'absolute', right:8, margin:15,}} >
                                    <TouchableOpacity 
                                        onPress={() => navigation.navigate("MProduk")}
                                    >
                                        <MaterialCommunityIcons
                                            name="eslint"
                                            color="black"
                                            size={24}
                                        />
                                        
                                    </TouchableOpacity>                                        
                                   
                                </View>

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
        padding:15, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2,
        flexDirection:'row',          
    },
})

