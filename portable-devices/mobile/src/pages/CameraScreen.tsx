import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, TouchableOpacity, Image} from 'react-native';
import { Camera } from 'expo-camera';
 
export default function CameraScreen() {
 const [hasCameraPermission, setHasCameraPermission] = useState(null);
 const [camera, setCamera] = useState(null);
 const [image, setImage] = useState(null);
 const [type, setType] = useState(Camera.Constants.Type.back);
useEffect(() => {
   (async () => {
     const cameraStatus = await Camera.requestCameraPermissionsAsync();
     setHasCameraPermission(cameraStatus.status === 'granted');
})();
 }, []);
 const ask = async() =>{
   await Camera.requestCameraPermissionsAsync();
     //setHasCameraPermission(cameraStatus.status === 'granted');
 }
const takePicture = async () => {
   if(camera){
       const data = await camera.takePictureAsync(null)
       setImage(data.uri);
   }
 }
 
 if (hasCameraPermission === false) {
 //   return  <View style={{
 //     flex: 1,
 //     alignItems:'center',
 //     justifyContent:'center'
 // }}><Text>No access to camera</Text></View>;
 ask();
 }
 return (
  <View style={{ flex: 1,}}>
     <View style={styles.cameraContainer}>
           <Camera
           ref={ref => setCamera(ref)}
           style={styles.fixedRatio}
           type={type}
           ratio={'16:9'} />
     </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.btnColor}
      onPress={() => {
             setType(
               type === Camera.Constants.Type.back
                 ? Camera.Constants.Type.front
                 : Camera.Constants.Type.back
             );
           }}>
       <Text style={styles.textStyle}>Flip Camera</Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.btnColor} onPress={() => takePicture()}>
       <Text style={styles.textStyle}>Take Picture</Text>
     </TouchableOpacity>
     {image && <Image source={{uri: image}} style={{width:100,height:100}}/>}
      </View>
      
  </View>
 );
}
const styles = StyleSheet.create({
 cameraContainer: {
     flex: 1,
     flexDirection: 'row',
     //alignItems:'center',
     justifyContent:'center'
 },
 fixedRatio:{
     //flex: 1,
     width:'100%',
     height:'80%',
 },
 buttonContainer:{
   width:'80%',
   alignSelf:'center',
   alignItems:'center',
   justifyContent:'center',
   marginBottom:20
 },
  btnColor: {
   padding: 10,
   paddingHorizontal:20,
   borderRadius: 40,
   backgroundColor: '#eee',
   marginTop: 10,
 },
 textStyle:{
   fontSize:20,
   fontWeight:'bold',
   textAlign:'center'
  
 }
})

