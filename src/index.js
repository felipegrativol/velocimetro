/**
 * App -Velocimetro
 *
 *
 * @author Luiz Felipe Henriques Grativol
 * 
 */

import React, {Component} from 'react';
import {
  StyleSheet,
   View,
   Text,
   Alert,
   ImageBackground,
  BackHandler,
  Dimensions
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import FusedLocation from 'react-native-fused-location';
import {PermissionsAndroid} from 'react-native';

import NumberFormat from 'react-number-format';



export default class App extends Component {
 
  constructor(props) {
    super(props);

     this.state = {
      speed:"",
    };
  }
  

async startGPS(){
  FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

       // Get speed once.
       const location = await FusedLocation.getFusedLocation();
       this.setState({ speed:location.speed });

       // Set options.
       FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
       FusedLocation.setLocationInterval(200);
       FusedLocation.setFastestLocationInterval(200);
       FusedLocation.setSmallestDisplacement(5);


       // Keep getting updated location.
       FusedLocation.startLocationUpdates();

       // Place listeners.
       this.subscription = FusedLocation.on('fusedLocation', location => {
          /* location = {
            latitude: 14.2323,
            longitude: -2.2323,
            speed: 0,
            altitude: 0,
            heading: 10,
            provider: 'fused',
            accuracy: 30,
            bearing: 0,
            mocked: false,
            timestamp: '1513190221416'
          }
          */
         this.setState({ speed:location.speed});
          console.log(location);
       });


    }

  async componentDidMount() {
    

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Este aplicativo necessita da sua localização',
          message: 'Permitir acesso a localização?'
          }
      );
if (granted === PermissionsAndroid.RESULTS.GRANTED ) {

    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2 style='color: #0af13e'>Ativar Localização?</h2>Este aplicativo necessita que o GPS esteja ativo.<br/><br/>Ativar GPS, Wi-Fi, e redes móveis para usar a localização?<br/><br/>",
      ok: "SIM",
      cancel: "NÃO",
      enableHighAccuracy: true, 
      showDialog: true, 
      openLocationServices: true, 
      preventOutSideTouch: false,
      preventBackClick: false,
      providerListener: false 
  }).then(()=> {
       this.startGPS();
  }).catch(() => {
    BackHandler.exitApp();
      Alert.alert("GPS desativado");
  });

}else{
  BackHandler.exitApp();
}



  }
 
  render(){
  return (
      <ImageBackground source={require('../images/backblack.jpg')} style={styles.backgroundImage}>
       <View style={styles.container}>
            

        <NumberFormat
             value={this.state.speed}
             displayType={'text'}
             format="####"
             thousandSeparator={true}
             renderText={value =><Text style={styles.velocimeter}>{value}</Text>}
         /> 
         <Text style={styles.km}> km/h</Text>
       
       </View>
       </ImageBackground >
  );
          }
};

const styles = StyleSheet.create({
  container:{
    flexDirection:"column",
    justifyContent: "center",
    alignItems:"center",
    width: "100%",
    height: "100%",

  },
 
  velocimeter: {
    fontSize: 200,
    fontWeight: '600',
    color: Colors.light,
    fontFamily:'DigitalDismay',
    textShadowColor: 'rgb(255,0,0)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
 
  km:{
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light,
    textShadowColor: 'rgb(255,0,0)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  
  },
  backgroundImage:{
    flex: 1,
    alignSelf: 'stretch',
    width: null,
  }


});

