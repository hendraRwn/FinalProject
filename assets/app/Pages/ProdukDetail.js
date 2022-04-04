import React, {useState,useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity } from 'react-native'
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

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

export default function ProdukDetail({ route, navigation }) {
    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      };

    const { paramId, paramDesc } = route.params;
    const userEmail = useSelector((state) => state.auth.userEmail);

    const getCurrentDateTime = () => { 
        var tgl = new Date();    
        var hasil = tgl.getFullYear()+""+setKarakter(tgl.getMonth())+setKarakter(tgl.getDay())+setKarakter(tgl.getHours())+setKarakter(tgl.getMinutes())+setKarakter(tgl.getSeconds());
        return hasil;
    }

    const setKarakter = (prm) => {
        var hasil = prm;
        if (parseInt(prm) < 10)
            hasil = '0'+prm;
        
        return hasil;
    }

    const produkid = useSelector((state) => state.produk.produkid);
	const kategoriid = useSelector((state) => state.produk.kategoriid);
	const kategorinama = useSelector((state) => state.produk.kategorinama);
	const namaproduk = useSelector((state) => state.produk.namaproduk);
	const harga = useSelector((state) => state.produk.harga);
    const berat = useSelector((state) => state.produk.berat);
    const gambar = useSelector((state) => state.produk.urlimage);
    const detailproduk = useSelector((state) => state.produk.detailproduk);

    const addToCart = async () => {		
        try {
			const db = getFirestore();
            const q = query(collection(db, 'cart'),where('email','==',userEmail),where('produkid','==',produkid));
            const querySnapshot = await getDocs(q);   
                    var jum = 0;
                    var rid = "";                 
                    querySnapshot.forEach(function(doc) {
                        jum = parseInt(doc.data().qty) + 1;
                        rid = doc.id;
                    });               
                    if (querySnapshot.size === 0){                                             
                        const docRef= addDoc(collection(db, "cart"), {
                            produkid: produkid,
                            namaproduk: namaproduk,
                            harga: harga,
                            qty: '1',
                            email: userEmail,
                            urlimage: gambar,
                            tgljam: getCurrentDateTime(),
                            created: Timestamp.now(),
                        });	        
                    }else{                       
                        const taskDocRef = doc(db, 'cart', rid)
                        updateDoc(taskDocRef, {
                          qty: jum,
                        });
                    }
                    navigation.navigate("Order")         			                    
		} catch (e) {
            alert("gagal simpan ke db "+ e);
		}
	};

    return (
        <View style={styles.container}>
                <Image 
                    style={{ height: 150, width: '98%',  resizeMode:'contain', margin:5, }}
                    source={{
                        uri:  gambar,
                    }}                                              
                />   

                <Text style={{ fontWeight:'bold', padding:8, fontSize:18,}}>{namaproduk}</Text>

                <View style={{width:'100%', alignItems:'flex-end', padding:5,}}>
                    <Text style={{fontWeight:'bold', color:'red'}}>{currencyFormat(parseInt(harga))}</Text>
                </View>

                <View style={{ backgroundColor:'#6872EB', height:25, width:'100%'}}>
                    <Text style={{padding:3, color:'white', fontSize:12, fontWeight:'bold',}}>Rincian Produk</Text>                   
                </View>

                
                    <View style={{flexDirection:'row', width:'100%', padding:10, paddingBottom:0,}} >
                        <Text style={{color:'black', width:100, fontWeight:'bold',}}>Kategori</Text>
                        <Text>: {kategorinama}</Text>
                    </View>
                    
                    <View style={{flexDirection:'row', width:'100%', padding:10, paddingBottom:0,}} >
                        <Text style={{color:'black', width:100, fontWeight:'bold',}}>Berat Produk</Text>
                        <Text>: {berat}</Text>
                    </View>
                    
                    <View style={{flexDirection:'row', width:'100%', padding:10, paddingBottom:0,}} >
                        <Text style={{color:'black', fontWeight:'bold',}}>Deskripsi Produk</Text>
                    </View>

                <ScrollView style={{width:'100%', padding:20, paddingTop:5,}}>
                    <View style={{flexDirection:'row', width:'100%', padding:2,}} >
                        <Text>{detailproduk}</Text>
                    </View>
                </ScrollView>

                <View style={{position:'absolute', bottom:5, left:0, right:0, alignItems:'flex-end', margin:10, paddingRight:10, }}>
                    <TouchableOpacity style={{ backgroundColor:'#3CAF47', padding:5, width:100, borderRadius:5, alignItems:'center', }}
                        onPress={()=>addToCart()}
                    >
                        <Text style={{fontSize:11, color:'white', fontWeight:'bold',}}>Beli Sekarang</Text>
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
        
    }
})
