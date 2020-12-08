import React, { useState, useRef, useEffect } from "react";
import {StyleSheet, Dimensions, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as MediaLibrary from 'expo-media-library';


//constant dimensions
const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function camera_video() {
    //state hooks
    const [hasPermission, setHasPermission] = useState(null);
    const [hasPermissionToMediaLib, setHasPermissionToMediaLib] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [isPreview, setIsPreview] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [videoSource, setVideoSource] = useState(null);

    //useRef hooks: like state hooks but changing them will not cause component to re-render
    //useRef object has { current } property
    const cameraRef = useRef();

/*Functions*****************************************************************************************************/

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const { mediaPermissionStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      setHasPermissionToMediaLib(mediaPermissionStatus === 'granted');
    })();
  }, []); //empty array never changes between different renders

  if (hasPermission === null) {
    return <View />;
  }
  
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  // if(hasPermissionToMediaLib === null){
  //   return <View />
  // }

  // if(hasPermissionToMediaLib === false){
  //   return <Text style={styles.text}>No access to media library</Text>
  // }

  //openCameraReady
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  //Take picture
  const takePicture = async() => {
    if(cameraRef.current){
        //to use expo-camera takePictureAsync() method requires options object which contain the picture configs
        const options ={
            quality : 1.0,
            base64: true
        };
        //promise returns object { uri, width, height, exif, base64 } 
        //where uri is a URI to the local image file on iOS and Android
        const data = await cameraRef.current.takePictureAsync(options);
        const source = data.uri;
        if(source){
            await cameraRef.current.pausePreview();
            setIsPreview(true);
            console.log("Picture source: ", source);
            const asset = await MediaLibrary.createAssetAsync(source);
        }
    }
  };

  //Record video
  const recordVideo = async() =>{
    if(cameraRef.current){
        const options = {
            quality: Camera.Constants.VideoQuality['1080p'],
            mute: true
        };
        try{
            const videoRecordPromise = cameraRef.current.recordAsync(options);
            if(videoRecordPromise){
              setIsVideoRecording(true);
              const data = await videoRecordPromise;
              const source = data.uri;
              if(source){
                  setIsPreview(true);
                  console.log("Video source: ", source);
                  setVideoSource(source);
                  const asset = await MediaLibrary.createAssetAsync(source);
              }
            }
        }catch(error){
            console.warn("Video error: ", error);
        }
    }
  };

  //Stop video recording
  const stopVideoRecording = () => {
    if(cameraRef.current){
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };


  //Switch camera types
  const switchCamera = () =>{
    if(isPreview){ 
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };


  //Cancel preview
  const cancelPreview = async() =>{
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
  }

  //Save video and picture

/*Render functions***********************************************************************************************/
  
const renderCancelPreviewButton = () => (
  <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
    <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
    <View
      style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
    />
  </TouchableOpacity>
);
 
const renderVideoPlayer = () => (
  <Video
    source={{ uri: videoSource }}
    shouldPlay={true}
    style={styles.media}
  />
);
  
const renderVideoRecordIndicator = () => (
  <View style={styles.recordIndicatorContainer}>
    <View style={styles.recordDot} />
    <Text style={styles.recordTitle}>{"Recording..."}</Text>
  </View>
);

const renderCaptureControl = () => (
  <View style={styles.control}>
    <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
      <Text style={styles.text}>{"Flip"}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!isCameraReady}
      onLongPress={recordVideo}
      onPressOut={stopVideoRecording}
      onPress={takePicture}
      style={styles.capture}
    />
  </View>
);
  
return (
      <SafeAreaView style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.container}
          type={cameraType}
          flashMode={Camera.Constants.FlashMode.off}
          onCameraReady={onCameraReady}
          onMountError={(error) => {
            console.log("cammera error", error);
          }}
        />
        <View style={styles.container}>
          {isVideoRecording && renderVideoRecordIndicator()}
          {videoSource && renderVideoPlayer()}
          {isPreview && renderCancelPreviewButton()}
          {!videoSource && !isPreview && renderCaptureControl()}
        </View>
      </SafeAreaView>
    );
  }


/*Styles**********************************************************************************************************/

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: 35,
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4c5c4",
    opacity: 0.7,
    zIndex: 2,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: "68%",
    height: 1,
    backgroundColor: "black",
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
  },
});

/*End*/

