import React, {useState, useCallback} from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput, Alert } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";
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
    orderBy, onSnapshot,
    doc, updateDoc, deleteDoc,
} from "firebase/firestore";

export default function MProduk({ route, navigation }) {
    const [ListData, setListData] = useState([]);
    const userEmail = useSelector((state) => state.auth.userEmail);

    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    };

    try{  
        useFocusEffect(
            useCallback(() => {                
                try{
                    const generateData = async () => {
                        try{                           
                            var dataTabel = []
                            const db = getFirestore();
                            const q = query(collection(db, 'produk'),orderBy('created','desc'))
                            
                            const querySnapshot = await getDocs(q);  
                            querySnapshot.forEach(function(doc) {                                                                
                                if (doc.data().namaproduk)
                                dataTabel.push({
                                    id: doc.id,
                                    data: doc.data(),
                                });                                                                                       
                            });              
                            
                            setListData(dataTabel);
                        }catch(err){}                
                    };
                        
                    generateData();                                         
                                    
                }catch(err){
                    alert(err)
                }
                
            }, []),
        );    
    }catch(err){alert(err)}

    const hapusData = async (pId, katid) => {
        try{
            const db = getFirestore();
            const q = query(collection(db, 'cart'), where('produkid','==',katid))                            
            const querySnapshot = await getDocs(q);  
            
            if (querySnapshot.size === 0){                
                const taskDocRef = doc(db, 'produk', pId)
                await deleteDoc(taskDocRef);
                
                navigation.navigate("LoadScreen",{
                    scrFrom : 'MProduk'
                });  
            }else{
                alert('Data tidak bisa dihapus, produk masih digunakan cart')
            }          
        } catch (err) {}    
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
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>navigation.goBack()} >                    
                    <MaterialCommunityIcons style={{padding:5,}}
                            name="arrow-left-circle-outline"
                            color="white"
                            size={20}
                        />
                    <Text style={{padding:5, paddingLeft:0, paddingTop:7, color:'white',fontSize:12, fontWeight:'bold',}}>Setting Produk</Text>                   
                </TouchableOpacity>                    
            </View>
            
            <View style={{padding:5,}}>
                
                
                <View style={{alignItems:'flex-end', width:300,}}>
                    <TouchableOpacity style={{padding:5, marginTop:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#404578', borderRadius:10, width:85}} 
                            onPress={() => navigation.navigate("MProdukAdd",{
                                paramId : '',
                                paramDesc : 'ADD',
                            })}
                    >
                        <MaterialCommunityIcons
                                name="plus-circle-outline"
                                color="white"
                                size={14}
                            />    
                        <Text style={{fontSize:11, color:'white',}}> Tambah</Text>
                            
                    </TouchableOpacity>  
                </View>
                
                
                <View style={{flex:1, paddingTop:10, paddingBottom:100,}}>
                    
                    <FlatList data={ListData} renderItem={({ item, index }) => 
                     {
                         
                         let warna = '#F1DDCF';
                         if (!(index % 2))
                            warna = '#B9BEF5';

                        return (<View>
                            <View style={[styles.rowItem, {backgroundColor:warna, padding:10,} ]} >                                                                        
                                <Image
                                    style={{ height: 85, width: 85, resizeMode:'cover', borderRadius:10, }}
                                    source={{
                                        uri: item.data.urlimage,
                                    }}
                                />
                                                                                                  
                                <View style={{ marginLeft:10, position:'absolute', right:5, width:190,}} >
                                    <View style={{flexDirection:'column', marginLeft:10, }}>
                                        <Text style={{fontSize:11, marginTop:3,}}>{item.data.namaproduk}</Text>
                                        <Text style={{fontSize:11, marginTop:3,}}>{item.data.kategorinama}</Text>
                                        <Text style={{fontSize:10, fontWeight:'bold'}}>{currencyFormat(parseInt(item.data.harga)) }</Text>                                                                             
                                    </View>
                                    
                                    <View style={{flexDirection:'row', marginLeft:10, marginTop:10, }}>
                                        <TouchableOpacity style={{margin:5, padding:3, paddingLeft:7, paddingRight:7, flexDirection:'row', backgroundColor:'#2430BD', borderRadius:10, width:65}} 
                                            onPress={() => navigation.navigate("MProdukAdd",{
                                                paramId : item.data.produkid,
                                                paramDesc : 'EDIT',
                                            })}
                                        >
                                            <MaterialCommunityIcons
                                                name="rename-box"
                                                color="white"
                                                size={14}
                                            />
                                            <Text style={{fontSize:11, color:'white',}}> Edit</Text>
                                        </TouchableOpacity>    

                                        <TouchableOpacity style={{margin:5,padding:3, paddingLeft:7, paddingRight:7, flexDirection:'row', backgroundColor:'#FF4B34', borderRadius:10, width:65}} 
                                            onPress={()=>Alert.alert(
                                                'Peringatan',
                                                'Anda yakin akan menghapus data ini ?',
                                                [
                                                    {
                                                        text: "Tidak",
                                                        onPress: () => console.log('tidak selected'),
                                                    },
                                                    {
                                                        text: "Ya",
                                                        onPress: () => hapusData(item.id, item.data.produkid),
                                                    }
                                                ]
                                            )}
                                        >
                                            <MaterialCommunityIcons
                                                name="delete-forever"
                                                color="white"
                                                size={14}
                                            />
                                            <Text style={{fontSize:11, color:'white',}}> Delete</Text>
                                        </TouchableOpacity>                                    
                                    </View>

                                </View>

                            </View>
                        </View>)
                     }
                    
                        
                    } numColumns={1} />  

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
        padding:3, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2,
        flexDirection:'row',          
    },
})

