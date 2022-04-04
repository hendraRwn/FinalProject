import React, {useState, useCallback} from 'react'
import { StyleSheet, Text, View, Image, FlatList, ScrollView,TouchableOpacity, TextInput, Alert } from 'react-native'
import { Data } from '../Router/data'

import {MaterialCommunityIcons} from "react-native-vector-icons";
import uuid from "react-native-uuid";
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

export default function MKategori({ route, navigation }) {
    const [nama, setNama] = useState("");
    const [gambar, setGambar] = useState("");
    const [btnLabel, setbtnLabel] = useState("Simpan");
    const [editId, seteditId] = useState("");
    const T = new Date();
    const unique_id = uuid.v4()+T.getHours+T.getMinutes+T.getSeconds+T.getMilliseconds;

    const [ListData, setListData] = useState([]);
    const userEmail = useSelector((state) => state.auth.userEmail);
    
    try{  
        useFocusEffect(
            useCallback(() => {                
                try{
                    const generateData = async () => {
                        try{                           
                            var dataTabel = []
                            const db = getFirestore();
                            const q = query(collection(db, 'kategori'),orderBy('created','desc'))
                            
                            const querySnapshot = await getDocs(q);  
                            querySnapshot.forEach(function(doc) {                                                                
                                if (doc.data().kategorinama)
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

    const submit = () => {
        if (!nama){
            alert('Isikan nama kategori terlebih dahulu');
            return false;
        }
        if (!gambar){
            alert('Isikan Image URL terlebih dahulu');
            return false;
        }

        simpanData(); 
    }

    const simpanData = async () => {		
        try {
			const db = getFirestore();

            if (btnLabel === "Update"){
                const taskDocRef = doc(db, 'kategori', editId)
                await updateDoc(taskDocRef, {
                    kategorinama: nama,
                    urlimage: gambar,
                })
            }else{
                const docRef = await addDoc(collection(db, "kategori"), {
                    kategoriid: unique_id,
                    kategorinama: nama,
                    urlimage: gambar,
                    created: Timestamp.now(),
                });	
            }
			
            setNama("");
            setGambar("");
            setbtnLabel("Simpan");

            navigation.navigate("LoadScreen",{
                scrFrom : 'MKategori'
            });   
            alert("Simpan data sukses");
		} catch (e) {
            alert("gagal simpan ke db "+ e);
		}
	};

    const hapusData = async (pId, katid) => {
        try{
            const db = getFirestore();
            const q = query(collection(db, 'produk'), where('kategoriid','==',katid))                            
            const querySnapshot = await getDocs(q);  
    
            if (querySnapshot.size === 0){                
                const taskDocRef = doc(db, 'kategori', pId)
                await deleteDoc(taskDocRef);
                setNama("");
                setGambar("");
                setbtnLabel("Simpan");
                navigation.navigate("LoadScreen",{
                    scrFrom : 'MKategori'
                });  
            }else{
                alert('Data tidak bisa dihapus, kategori masih digunakan produk')
            }          
        } catch (err) {}    
    }

    const toEdit = async (dataEdit) => {
        setNama(dataEdit.data.kategorinama);
        setGambar(dataEdit.data.urlimage);
        setbtnLabel('Update');
        seteditId(dataEdit.id);
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
                    <Text style={{padding:5, paddingLeft:0, paddingTop:7, color:'white',fontSize:12, fontWeight:'bold',}}>Setting Kategori</Text>                   
                </TouchableOpacity>                    
            </View>
            
            <View style={{padding:15,}}>
                <View style={{ alignItems:'flex-start', marginBottom: 10, }}>
                    <Text style={{fontSize:12,}}>Nama Kategori</Text>
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

                <View style={{alignItems:'flex-end'}}>
                    <TouchableOpacity style={{padding:5, marginTop:5, paddingLeft:10, paddingRight:10, flexDirection:'row', backgroundColor:'#3CAF47', borderRadius:10, width:85}} 
                            onPress={submit}
                    >
                        <MaterialCommunityIcons
                                name="check-circle-outline"
                                color="white"
                                size={14}
                            />    
                        <Text style={{fontSize:11, color:'white',}}>{btnLabel}</Text>
                            
                    </TouchableOpacity>  
                </View>
                
                <View style={{flexDirection:'row', marginTop:10, borderColor:'blue', borderStyle:'solid', borderBottomWidth:0.3,}}>
                    <MaterialCommunityIcons style={{fontWeight:'bold'}}
                                name="reorder-horizontal"
                                color="black"
                                size={20}
                            />  
                    <Text style={{fontWeight:'bold'}}>List Kategori</Text>
                </View>

                <View style={{flex:1}}>
                    
                    <FlatList data={ListData} renderItem={({ item, index }) => 
                     {
                         
                         let warna = '#F1DDCF';
                         if (!(index % 2))
                            warna = '#B9BEF5';

                        return (<View>
                            <View style={[styles.rowItem, {backgroundColor:warna} ]} >                                                                                                                                       
                                <Text style={{fontSize:12, marginTop:3,}}>{item.data.kategorinama}</Text>                                                                                                                                     
                                <View style={{ flexDirection:'row', position:'absolute', right:10, padding:5,}} >
                                    <TouchableOpacity
                                        onPress={() => toEdit(item)}
                                    >
                                        <MaterialCommunityIcons
                                            name="rename-box"
                                            color="black"
                                            size={22}
                                        />                                        
                                    </TouchableOpacity>                                        
                                    
                                    <TouchableOpacity style={{marginLeft:3,}}
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
                                                    onPress: () => hapusData(item.id, item.data.kategoriid),
                                                }
                                            ]
                                        )}
                                    >
                                        <MaterialCommunityIcons
                                            name="delete-forever"
                                            color="#FF4B34"
                                            size={22}
                                        />                                        
                                    </TouchableOpacity> 

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
        padding:6, 
        borderStyle:"solid", 
        borderColor:"blue", 
        borderWidth:0.2,
        flexDirection:'row',          
    },
})

