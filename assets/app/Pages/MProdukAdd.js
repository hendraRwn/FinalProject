import React, {useState,useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput, Picker, SrollView } from 'react-native'
import { Data } from '../Router/data'
import {MaterialCommunityIcons} from "react-native-vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import uuid from "react-native-uuid";

import { getAuth } from "firebase/auth";
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

export default function MProdukAdd({ route, navigation }) {
    const { paramId, paramDesc } = route.params;

    const [kategori, setKategori] = useState("");
    const [NamaKategori, setNamaKategori] = useState("");
    const [nama, setNama] = useState("");
    const [gambar, setGambar] = useState("");
    const [harga, setHarga] = useState("");
    const [berat, setBerat] = useState("");
    const [detail, setDetail] = useState("");

    const [listKategori, setListKategori] = useState([])
    const [EditId, setEditId] = useState([])
    const T = new Date();
    const unique_id = uuid.v4()+T.getHours()+T.getMinutes()+T.getSeconds()+T.getMilliseconds();

    useFocusEffect(
		useCallback(() => {
			const generateKategori = async () => {
                var dataTabel = []
                const db = getFirestore();
                const q = query(collection(db, 'kategori'), orderBy('created', 'asc'))
                const querySnapshot = await getDocs(q);  
                querySnapshot.forEach(function(doc) {                                                                
                    if (doc.data().kategorinama)
                        dataTabel.push({
                            id: doc.id,
                            data: doc.data(),
                    });                                                                                       
                });
                setListKategori(dataTabel);                
			};

            const generateProduk = async () => {
                
                const db = getFirestore();
                const q = query(collection(db, 'produk'), where('produkid', '==', paramId))
                const querySnapshot = await getDocs(q);  
                querySnapshot.forEach(function(doc) {                                                                
                    if (doc.data().namaproduk){
                        setEditId(doc.id);
                        setKategori(doc.data().kategoriid);
                        setNamaKategori(doc.data().kategorinama);
                        setNama(doc.data().namaproduk);
                        setGambar(doc.data().urlimage);
                        setHarga(doc.data().harga);
                        setBerat(doc.data().berat);
                        setDetail(doc.data().detailproduk);
                    }                                                                                                                                       
                });                             
			};

			generateKategori();
            if (paramDesc === "EDIT"){
                generateProduk();
            }
		}, []),
	);

    const onValueChangeCat = async (value) => {            
        var dataSplit = value.split("[c]");
        var val = dataSplit[0];
        var lbl = dataSplit[1];
        setKategori(val);
        setNamaKategori(lbl);
    }

    const submit = () => {
        if (!kategori){
            alert('Pilih kategori terlebih dahulu');
            return false;            
        } 
        if (!nama){
            alert('Isikan nama produk terlebih dahulu');
            return false;            
        }  
        if (!gambar){
            alert('Isikan gambar produk terlebih dahulu');
            return false;            
        }  
        if (!harga){
            alert('Isikan harga produk terlebih dahulu');
            return false;            
        }  
        if (!berat){
            alert('Isikan berat produk terlebih dahulu');
            return false;            
        }  
        if (!detail){
            alert('Isikan detail produk terlebih dahulu');
            return false;            
        }        
        
        simpanData(); 
    }

    const simpanData = async () => {		
        try {
			const db = getFirestore();

            if (paramDesc === "ADD"){
                const docRef = await addDoc(collection(db, "produk"), {
                    kategoriid: kategori,
                    produkid: unique_id,
                    namaproduk: nama,
                    kategorinama: NamaKategori,
                    urlimage: gambar,
                    berat: berat,
                    harga: harga,
                    detailproduk: detail,
                    created: Timestamp.now(),
                });	
            }else{
                const taskDocRef = doc(db, 'produk', EditId)
                await updateDoc(taskDocRef, {
                    kategoriid: kategori,                    
                    namaproduk: nama,
                    kategorinama: NamaKategori,
                    urlimage: gambar,
                    berat: berat,
                    harga: harga,
                    detailproduk: detail,
                })
            }
			
            navigation.navigate("MProduk");
		} catch (e) {
            alert("gagal simpan ke db "+ e);
		}
	};    

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
            
            <ScrollView style={{padding:15,}}>
                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Kategori</Text>
                    <Picker
                        itemStyle={styles.itemStyle}
                        mode="dropdown"
                        style={styles.pickerStyle}                        
                        selectedValue={kategori +"[c]"+ NamaKategori}
                        onValueChange={onValueChangeCat.bind(this)}
                    >
                        {listKategori.map((task) => (
         
                        
                       /* state.category.map((item, index) => (*/
                        <Picker.Item                            
                            color="#0087F0"
                            label={task.data.kategorinama}
                            value={task.data.kategoriid+'[c]'+task.data.kategorinama}
                            index={task.id}
                        />
                        ))}
                    </Picker>
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Nama Produk</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#213CB9',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        value={nama}
                        onChangeText={(value)=>setNama(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Image URL</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#213CB9',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        value={gambar}
                        onChangeText={(value)=>setGambar(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Harga</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#213CB9',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        value={harga}
                        onChangeText={(value)=>setHarga(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Berat Produk</Text>
                    <TextInput
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#213CB9',
                        paddingLeft:10,
                        paddingRight:10,
                        borderRadius: 2,
                        width: 280,                                             
                        }}
                        placeholder=""
                        value={berat}
                        onChangeText={(value)=>setBerat(value)}
                    />   
                </View>

                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Detail Produk</Text>
                    <TextInput multiline={true} 
                        style={{
                        borderWidth: 0.2,
                        borderColor:'#213CB9',
                        padding:10,                      
                        borderRadius: 2,
                        textAlignVertical:'top',
                        width: 280,     
                        height:150,                                        
                        }}
                        placeholder=""
                        value={detail}
                        onChangeText={(value)=>setDetail(value)}
                    />   
                </View>

                <View style={{alignItems:'center', flexDirection:'row'}}>
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
                
               
                
            </ScrollView>

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
    viewStyle: {
        flex: 1,
        alignSelf: "center",
        flexDirection: "row",
        width: "92%",
        justifyContent: "space-between",
        alignItems: "center"
      },
      itemStyle: {
        fontSize: 10,
        color: "#007aff"
      },
      pickerStyle: {
        width: "100%",
        height: 40,
        color: "#007aff",
        fontSize: 14,
      },
      textStyle: {
        fontSize: 14,
      }
})