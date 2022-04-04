import React, {useState,useCallback, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function LoadScreen({route, navigation}) {
    const { scrFrom } = route.params;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          navigation.navigate(scrFrom)
        });
        return unsubscribe;
      }, []);

    return (
        <View style={styles.container}>
            <Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    }
})
