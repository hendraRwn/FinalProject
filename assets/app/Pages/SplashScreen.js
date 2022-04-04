import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

export default function Splash({navigation}) {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
      
        await SplashScreen.hideAsync();
        
        await Font.loadAsync(Entypo.font);
        
        await new Promise(resolve => setTimeout(resolve, 8000));
      } catch (e) {
        console.warn(e);
      } finally {
        
        console.log("setAppIsReady");
        setAppIsReady(true);
       
       

      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    console.log("App ready call back");
    if (appIsReady) {
      
      console.log("App ready");
      await SplashScreen.hideAsync();
      
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      onLayout={onLayoutRootView}>
      <Text>SplashScreen Demoxx! 👋</Text>
      <Entypo name="rocket" size={30} />
    </View>
  );
}