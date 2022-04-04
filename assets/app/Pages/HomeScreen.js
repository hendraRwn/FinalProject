import React, {useState,useCallback, useEffect } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, } from 'react-native'
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
import { useDispatch } from "react-redux";
import { setDataProduk, clearData } from "../Redux/detProduct";
import { useSelector } from "react-redux";

export default function Home({route, navigation}) {
    
    

    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.auth.userEmail);

    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      };
    
    const [listKategori, setListKategori] = useState([]);
    const [listProduk, setListProduk] = useState([]);
    const [listDetProduk, setListDetProduk] = useState([]);
    const [cari, setCari] = useState("");

    let NamaKategori = [];

    try{
        useFocusEffect(
            useCallback(() => {
                try{
                    const generateKategori = async () => {
                        try{
                            const db = getFirestore();
                            const q = query(collection(db, 'kategori'), orderBy('created', 'asc'))
                            const querySnapshot = await getDocs(q);                            
                                setListKategori(querySnapshot.docs.map(doc => ({
                                    id: doc.id,
                                    data: doc.data()
                                })))            
                            
                            listKategori.map((item) => {
                                NamaKategori[item.data.kategoriid] = item.data.kategorinama;                                       
                            });
                        }catch(err){
        
                        }                
                    };
        
                    const generateProduk = async () => {
                        const db = getFirestore();
                        const q = query(collection(db, 'produk'), orderBy('created', 'asc'))
                        const querySnapshot = await getDocs(q);               
                            setListProduk(querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                data: doc.data()
                            })))            
                           
                    };
        
                    generateKategori();
                    generateProduk();    
                }catch(err){
                }
                
            }, []),
        );
    
    }catch(err){}

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

    const viewDetail = async (paramId) => {        	
            try{                        
                dispatch(clearData());
                setListDetProduk([]);
                const db = getFirestore();
                var dataProduk = {}
                const q = query(collection(db, 'produk'),where('produkid','==',paramId.trim()));
                const querySnapshot = await getDocs(q);                 
                    querySnapshot.forEach(function(doc) {
                        dataProduk = {
                            rowid: doc.id,
                            produkid: doc.data().produkid,
                            kategoriid: doc.data().kategoriid,
                            kategorinama: doc.data().kategorinama,
                            namaproduk: doc.data().namaproduk,
                            harga: doc.data().harga,
                            berat: doc.data().berat,
                            urlimage: doc.data().urlimage,
                            detailproduk: doc.data().detailproduk,
                        }
                        
                        dispatch(setDataProduk(dataProduk));
                        navigation.navigate("ProdukDetail",{
                            paramId: dataProduk.produkid,
                            paramDesc: '',
                        });
                    });
            }catch(err){}	
    }

    const addToCart = async (itemProduk) => {		
        try {
			const db = getFirestore();
            const q = query(collection(db, 'cart'),where('email','==',userEmail),where('produkid','==',itemProduk.produkid));
            const querySnapshot = await getDocs(q);   
                    var jum = 0;
                    var rid = "";                 
                    querySnapshot.forEach(function(doc) {
                        jum = parseInt(doc.data().qty) + 1;
                        rid = doc.id;
                    });               
                    if (querySnapshot.size === 0){                                             
                        const docRef= addDoc(collection(db, "cart"), {
                            produkid: itemProduk.produkid,
                            namaproduk: itemProduk.namaproduk,
                            harga: itemProduk.harga,
                            qty: '1',
                            email: userEmail,
                            tgljam: getCurrentDateTime(),
                            urlimage: itemProduk.urlimage,
                            created: Timestamp.now(),
                        });	        
                    }else{                       
                        const taskDocRef = doc(db, 'cart', rid)
                        updateDoc(taskDocRef, {
                          qty: jum,
                        });
                    }
                    alert("Produk berhasil ditambahkan ke keranjang");          			                    
		} catch (e) {
            alert("gagal simpan ke db "+ e);
		}
	};

    const searchData = async (paramSearch) => {
        navigation.replace("HomeScreen",{
            paramSearch: paramSearch,
        }) 
    };


    return (
        <View style={[styles.container,{top:0}]}>
            <View style={{flexDirection:"row", height:100, width:'100%', backgroundColor:'#6872EB',}}>
                <Image
                     style={{ resizeMode:'stretch', height:100, width:'100%', }}
                    source={require('../assets/header2.png')}
                />

                <View style={{position:'absolute', top:0, left:0, right:0,}}>
                    <TextInput
                        style={{                       
                            margin:3,                        
                            paddingVertical: 1,
                            borderRadius: 2,
                            width: 200,
                            paddingHorizontal: 1,
                            backgroundColor:'white',
                            paddingLeft:5,
                            fontSize:12,
                        }}
                        placeholder="Cari Produk"  
                        value={cari}
                        onChangeText={(value)=>setCari(value)}                      
                    /> 

                    <TouchableOpacity style={{ position:'absolute', left:175, paddingTop:6,}}
                        onPress={()=>navigation.navigate("KategoriDetail",{
                            paramId: '',
                            paramDesc: 'Semua Produk',
                            paramCari: cari,
                        })}
                    >                       
                        <MaterialCommunityIcons
                            name="magnify"
                            color="white"
                            size={22}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ position:'absolute', right:2, padding:5,}}>
                            <MaterialCommunityIcons
                            name="basket"
                            color="white"
                            size={26}               
                            onPress={()=>navigation.navigate("Order")}

                            />

                    </TouchableOpacity>

                </View>    

                <View style={{position:'absolute', bottom:5, left:0, right:0, alignItems:'flex-end', margin:5, }}>
                    <TouchableOpacity style={{ backgroundColor:'#404578', padding:5, width:120, borderRadius:30, alignItems:'center', }} >
                        <Text style={{fontSize:11, color:'white', fontWeight:'bold',}}>Promo Hari Ini </Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ backgroundColor:'white', height:130, width:'100%',}}>
                <View style={{ backgroundColor:'#6872EB', height:25, width:'100%'}}>
                    <Text style={{padding:3, color:'white', fontSize:12,}}>KATEGORI</Text>

                    <TouchableOpacity style={{padding:5, alignItems:'center', flexDirection:'row', position:'absolute', right:0,}} >
                        <Text style={{fontSize:11, color:'white',}}>Lihat Lainnya </Text>
                        <MaterialCommunityIcons
                            name="arrow-right-circle-outline"
                            color="white"
                            size={12}                         
                            />
                    </TouchableOpacity>
                </View>

                <View style={{width:'100%', flex:1, flexDirection:'row'}}>
                    <FlatList data={listKategori} renderItem={({ item }) => {
                        if (item.data.urlimage) 
                        return (
                            <View style={{alignItems:"center"}}>
                            <View style={{alignItems:"center", 
                                width:100, 
                                margin:3, 
                                padding:3,                                 
                                borderWidth:0.2,}}>
                                
                                <TouchableOpacity onPress={()=>navigation.navigate("KategoriDetail",{
                                                paramId: item.data.kategoriid,
                                                paramDesc: item.data.kategorinama,
                                                paramCari: '',
                                            }
                                )} style={{alignItems:'center'}} > 
                                        <Image 
                                            style={{ height: 60, width: 60 }}
                                            source={{
                                                uri: item.data.urlimage,
                                              }}                                              
                                        />                                        
                                        <Text   style={{fontSize:10,}}>{item.data.kategorinama}</Text>                  
                                </TouchableOpacity>                                                                         
                            </View>
                            </View>
                        ); }
                    } numColumns={1} horizontal />

                   
                </View>
                
            </View>

            <View style={{backgroundColor:'white', flex:1, width:'100%',}}>
                <View style={{ backgroundColor:'#6872EB', height:25, width:'100%'}}>
                    <Text style={{padding:3, color:'white', fontSize:12,}}>PRODUK</Text>

                    <TouchableOpacity style={{padding:5, alignItems:'center', flexDirection:'row', position:'absolute', right:0,}} 
                        onPress={()=>navigation.navigate("KategoriDetail",{
                            paramId: '',
                            paramDesc: 'Semua Produk',
                            paramCari: '',
                        })}
                    >
                        <Text style={{fontSize:11, color:'white',}}>Lihat Lainnya </Text>
                        <MaterialCommunityIcons
                            name="arrow-right-circle-outline"
                            color="white"
                            size={12}                         
                            />
                    </TouchableOpacity>
                </View>

                <View style={{ flex:1, flexDirection:'row', width:'100%',}}>       
                    
                    <FlatList data={listProduk} renderItem={({ item }) => {
                        if (item.data.urlimage) 
                        return (
                            
                            <View style={{alignItems:"center"}}>
                                <View style={styles.rowItem} >                                                                        
                                    <Image
                                        style={{ height: 95, width: '100%', resizeMode:'cover', }}
                                        source={{
                                            uri: item.data.urlimage,
                                          }}    
                                    />
                                    <Text style={{fontSize:11, marginTop:3,}}>{item.data.namaproduk}</Text>
                                    <Text style={{fontSize:10, fontWeight:'bold'}}>{currencyFormat(parseInt(item.data.harga)) }</Text>                                       
                                        
                                    <View style={{alignItems:'flex-end', flexDirection:'row'}} >
                                        <TouchableOpacity style={{padding:5, alignItems:'flex-end', flexDirection:'row',}} 
                                            onPress={()=>addToCart(item.data)}
                                        >
                                            <MaterialCommunityIcons
                                                name="basket"
                                                color="#6872EB"
                                                size={14}
                                            />
                                            <Text style={{fontSize:11, color:'#6872EB',}}>Add to cart </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{padding:5, alignItems:'flex-end', flexDirection:'row',}} 
                                            onPress={()=>viewDetail(item.data.produkid)}
                                        >
                                           
                                            <Text style={{fontSize:11, color:'#6872EB',}}>Detail </Text>
                                            <MaterialCommunityIcons
                                                name="arrow-right-circle"
                                                color="#6872EB"
                                                size={12}
                                            />
                                        </TouchableOpacity>

                                       
                                    </View>

                                </View>
                            </View>
                        ); }
                    } numColumns={2} />   
                
                </View>
                
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        
        alignItems: 'center',
        
        flexDirection:'column',
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
        width:150, 
        margin:5, 
        padding:5, 
        borderRadius:5, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2        
    },
})
