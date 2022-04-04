import React, {useState,useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";
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
    orderBy, onSnapshot,
    arrayContains,
    whereField,
    doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { setDataProduk, clearData } from "../Redux/detProduct";


export default function KategoriDetail({ route, navigation }) {
    const dispatch = useDispatch();

    const { paramId, paramDesc, paramCari } = route.params;
    const [listProduk, setListProduk] = useState([]);
    const userEmail = useSelector((state) => state.auth.userEmail);
    const [cari, setCari] = useState("");

    const getCurrentDateTime = () => { 
        var tgl = new Date();    
        var hasil = tgl.getFullYear()+""+setKarakter(tgl.getMonth())+setKarakter(tgl.getDay())
        +setKarakter(tgl.getHours())+setKarakter(tgl.getMinutes())+setKarakter(tgl.getSeconds());
        return hasil;
    }

    const setKarakter = (prm) => {
        var hasil = prm;
        if (parseInt(prm) < 10)
            hasil = '0'+prm;
        
        return hasil;
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
                            urlimage: itemProduk.urlimage,
                            tgljam: getCurrentDateTime(),
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

    const viewDetail = async (paramId) => {        	
        try{                        
            dispatch(clearData());
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
        }catch(err){alert(err)}	
    }

    
    try{
        
        useFocusEffect(
            useCallback(
                () => {		
                try{                  
                    const generateProduk = async () => {
                        
                        const db = getFirestore();
                        let q;
                        if (!paramId){
                            q = query(collection(db, 'produk'),
                            )  
                        }else{
                            q = query(collection(db, 'produk'),where('kategoriid','==',paramId.trim()))  
                        }   

                        const querySnapshot = await getDocs(q);  
                        var dataProduk = []
                        querySnapshot.forEach(function(doc) {                                
                            if (!paramCari){
                                dataProduk.push({
                                    id: doc.id,
                                    data: doc.data(),
                                });    
                            }else{
                                
                                if (doc.data().namaproduk.toUpperCase().includes(paramCari.toUpperCase()))
                                    dataProduk.push({
                                        id: doc.id,
                                        data: doc.data(),
                                    });    
                            }
                                                                                                               
                        });
                        setListProduk(dataProduk);

                       
                    };
        
                    generateProduk();    
                   
                }catch(err){
                }	
            
            }, [])
        );
        
    }catch(err){
    }
    
    
    const currencyFormat=(num)=> {
        return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    };
   
    var lblCari = 'Cari dalam kategori '+paramDesc;
    return (
        <View style={styles.container}>
                <Image
                    style={{ resizeMode:'stretch', height:100, width:'100%', }}
                    source={require('../assets/header2.png')}
                />

                <View style={{position:'absolute', top:0, left:0, right:0, alignItems:'flex-end'}}>
                    <TextInput
                        style={{
                            margin:3,                        
                            paddingVertical: 1,
                            borderRadius: 2,
                            width: 220,
                            paddingHorizontal: 1,
                            backgroundColor:'white',
                            paddingLeft:5,
                            fontSize:12,
                        }}
                        placeholder={lblCari}  
                        value={cari}
                        onChangeText={(value)=>setCari(value)}                      
                    /> 

                    <TouchableOpacity style={{ position:'absolute', paddingTop:6, right:5,}}
                        onPress={()=>navigation.replace("KategoriDetail",{
                            paramId: paramId,
                            paramDesc: paramDesc,
                            paramCari: cari,
                        })}
                    >                       
                        <MaterialCommunityIcons
                            name="magnify"
                            color="black"
                            size={22}
                        />
                    </TouchableOpacity>                    

                </View>    

                <View style={{ backgroundColor:'#82A7F4', height:30, width:'100%'}}>
                    <Text style={{padding:5, color:'black', fontSize:12, fontWeight:'bold',}}>Produk Kategori {paramDesc} </Text>                   
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
                                            <Text style={{fontSize:11, color:'#6872EB',}}>Add to chart </Text>
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
        width:150, 
        margin:5, 
        padding:5, 
        borderRadius:5, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2        
    },
})

