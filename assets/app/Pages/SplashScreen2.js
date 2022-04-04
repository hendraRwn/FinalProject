import React from 'react'
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Router from '../Router'

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});
 

export default function SplashScreen2({navigation}) {
  
  return (
    /*
      <View style={{flex:1, backgroundColor:'red'}}>
        <Text>bljhj jh</Text>
      </View>
    */
        <AnimatedAppLoader 
          image={require('../assets/logo_awalRGS.png')}
        >
          <Router />
        </AnimatedAppLoader>
    
  );
}

function AnimatedAppLoader({ children, image }) {
  const [isSplashReady, setSplashReady] = useState(false);

  const startAsync = useCallback(
    // If you use a local image with require(...), use `Asset.fromModule`
    () => Asset.fromModule(require('../assets/logo_awalRGS.png')),

    [image]
  );

  const onFinish = useCallback(() => setSplashReady(true), []);

  if (!isSplashReady) {
    return (
      <AppLoading
        // Instruct SplashScreen not to hide yet, we want to do this manually
        autoHideSplash={false}
        startAsync={startAsync}
        onError={console.error}
        onFinish={onFinish}
      />
    );
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children, image }) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {

      Animated.timing(animation, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
      
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor:'red' }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest.splash.backgroundColor,
              /*opacity: animation,*/
            },
          ]}
        >
         
          
          <Animated.Image
            style={{
              flex:1,
              backgroundColor:'#000000',
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest.splash.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

