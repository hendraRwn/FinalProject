import React, {useState,useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput, Alert } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";
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
import { useSelector } from "react-redux";

export default function OrderScreen({ route, navigation }) {

   const [listCart, setListCart] = useState([]);
   const userEmail = useSelector((state) => state.auth.userEmail);
   const [QTY, setQTY] = useState([]);

   const [totalHarga, setTotalHarga] = useState(0);

    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    };

    try{  
        useFocusEffect(
            useCallback(() => {
                
                try{
                    const generateCart = async () => {
                        try{

                            setListCart([]);
                            var dataCart = []
                            let Total = 0;
                            const db = getFirestore();
                            const q = query(collection(db, 'cart'), where('email','==',userEmail))
                            
                            const querySnapshot = await getDocs(q);  
                            querySnapshot.forEach(function(doc) {                                
                                Total = Total + (parseInt(doc.data().qty) * parseInt(doc.data().harga));
                                dataCart.push({
                                    id: doc.id,
                                    data: doc.data(),
                                });                                                                                       
                            });
                            setListCart(dataCart); 
                            setTotalHarga(Total);

                        }catch(err){}                
                    };
                        
                    generateCart();                                         
                                    
                }catch(err){
                }
                
            }, []),
        );
    
    }catch(err){}

    const hapusData = async (pId) => {
        try{
            const db = getFirestore();
            const taskDocRef = doc(db, 'cart', pId)
          await deleteDoc(taskDocRef);
          navigation.navigate("LoadScreen",{
              scrFrom : 'Order'
          });  
        } catch (err) {}    
    }

    const addToCart = async (itemProduk, tipe) => {		
        try {
			const db = getFirestore();
            const q = query(collection(db, 'cart'),where('email','==',userEmail),where('produkid','==',itemProduk.produkid));
            const querySnapshot = await getDocs(q);   
                    var jum = 0;
                    var rid = "";                 
                    querySnapshot.forEach(function(doc) {
                        if (tipe == "-"){
                            jum = parseInt(doc.data().qty) - 1;
                        }else{
                            jum = parseInt(doc.data().qty) + 1;
                        }
                        
                        rid = doc.id;
                    });               
                    if (jum < 1){                                             
                        try{                            
                            const taskDocRef = doc(db, 'cart', rid)
                            await deleteDoc(taskDocRef);                         
                        } catch (err) {}
                    }else{                       
                        const taskDocRef = doc(db, 'cart', rid)
                        updateDoc(taskDocRef, {
                          qty: jum,
                        });
                    }
                    navigation.navigate("LoadScreen",{
                        scrFrom : 'Order'
                    });                           			                    
		} catch (e) {
            alert("gagal simpan ke db "+ e);
		}
	};

    return (
        <View style={styles.container}>
                <Image
                     style={{ resizeMode:'stretch', height:80, width:'100%', }}
                    source={require('../assets/header2.png')}
                />

                
                <View style={{ backgroundColor:'#82A7F4', height:30, width:'100%', flexDirection:'row',}}>
                    <MaterialCommunityIcons style={{padding:5,}}
                            name="basket-fill"
                            color="white"
                            size={20}
                        />
                    <Text style={{padding:5, paddingLeft:0, paddingTop:7, color:'white', fontSize:12, fontWeight:'bold',}}>Keranjang Saya</Text>                   
                </View>

                <View style={{ flex:7, flexDirection:'row', width:'100%',}}>       
                    
                        
                    <FlatList data={listCart} renderItem={({ item, index }) => 
                     {
                         
                         let warna = '#F1DDCF';
                         if (!(index % 2))
                            warna = 'white';

                        return (<View style={{alignItems:"stretch"}}>
                            <View style={[styles.rowItem, {backgroundColor:warna} ]} >                                                                        
                                <Image
                                    style={{ height: 50, width: 50, resizeMode:'cover', }}                                    
                                    source={{
                                        uri: item.data.urlimage,
                                    }}
                                />
                                <View style={{flexDirection:'column', marginLeft:10, width:120, }}>
                                    <Text style={{fontSize:10, marginTop:3,}}>{item.data.namaproduk}</Text>
                                    <Text style={{fontSize:10, fontWeight:'bold'}}>{currencyFormat(parseInt(item.data.harga)) }</Text>                                                                             
                                </View>

                                <View style={{ position:'absolute',
                                        right:85, alignItems:'center',}}>
                                    <Text
                                        style={{                       
                                            margin:3,                                                       
                                            
                                            borderRadius: 2,
                                            borderStyle:"solid", 
                                            borderColor:"blue", 
                                            borderWidth:0.2,
                                            width: 30,
                                        
                                            backgroundColor:'white',
                                            textAlign:'center',                                    
                                            fontSize:12,
                                            padding:5,

                                        }}                                                    
                                    >{item.data.qty}</Text>

                                    <View style={{flexDirection:'row', alignItems:'center',}}>
                                        <TouchableOpacity onPress={() => addToCart(item.data, '+')}>
                                            <MaterialCommunityIcons style={{margin:2,}}
                                                name="plus-circle"
                                                color="black"
                                                size={20}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => addToCart(item.data, '-')}>
                                            <MaterialCommunityIcons style={{margin:2,}}
                                                name="minus-circle"
                                                color="black"
                                                size={20}
                                            />
                                        </TouchableOpacity>                                        
                                        
                                    </View>
                                </View>
                                  
                                <View style={{ marginLeft:10, position:'absolute', right:10,}} >
                                    <TouchableOpacity style={{padding:3, paddingLeft:7, paddingRight:7, flexDirection:'row', backgroundColor:'#FF4B34', borderRadius:10, width:65}} 
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
                                                    onPress: () => hapusData(item.id),
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
                        </View>)
                     }
                    
                        
                    } numColumns={1} />   
                
                </View>
                
                <View style={{flex:1, alignItems:'flex-end', width:'100%', padding:10, paddingVertical:1,}}>
                    <Text style={{fontWeight:'bold', fontSize:14, color:'#404578'}}>{currencyFormat(parseInt(totalHarga)) }</Text>
                    
                    <TouchableOpacity style={{padding:5, marginTop:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#404578', borderRadius:10, width:85}} 
                                        onPress={() => alert('Terimakasih Telah Berbelanja di Toko Kami')}
                        >
                                        
                        <Text style={{fontSize:11, color:'white',}}>Checkout </Text>
                        <MaterialCommunityIcons
                            name="logout-variant"
                            color="white"
                            size={14}
                        />
                    </TouchableOpacity>    

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
        alignItems:"center", 
        width:'100%', 
        margin:0, 
        padding:10, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2,
        flexDirection:'row',          
    },
})

