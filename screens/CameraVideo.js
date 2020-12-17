import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from "@react-native-async-storage/async-storage";

//constant dimensions
const WINDOW_HEIGHT = Dimensions.get("window").height;
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function CameraVideo({navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [pictureUri, setPictureUri] = useState(null);
    const [videoUri, setVideoUri] = useState(null);
    const cameraRef = useRef();

/******************** EVENT HANDLERS ******************************************************************************/

    //check permission to use camera
    //check permission to access library
    useEffect(() => {
        (async () => {
          const { cameraPermissionStatus } = await Camera.requestPermissionsAsync();
          setHasCameraPermission(cameraPermissionStatus === 'granted');
        })();
        (async () => {
            const { libraryPermissionStatus } = await MediaLibrary.requestPermissionsAsync();
            setHasLibraryPermission(libraryPermissionStatus === 'granted');
        })();

        console.log("Initial State - isVideoRecording: " , isVideoRecording, " isPreview: ", 
         isPreview, " pictureUri: " , pictureUri, " videoUri: " , videoUri);
    },[]);

    //re-render whenever certain useStates change
    useEffect(() => {
        console.log("A state has changed - isVideoRecording: " , isVideoRecording, " isPreview: ", 
         isPreview, " pictureUri: " , pictureUri, " videoUri: " , videoUri);
    },[isVideoRecording, isPreview, pictureUri, videoUri]);

    // console.log("A state has changed: " , isVideoRecording, isPreview, isVideoPlayback, uri);
    // isVideoRecording, isPreview, isVideoPlayback, uri

    //check camera is ready
    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    //flip camera
    const switchCamera = () => {
        setCameraType((prevCameraType) =>
        prevCameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    };

    //take picture
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
                setPictureUri(source);
            }
        }
    };

    //start video recording
    const recordVideo = async() => {
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
                      setVideoUri(source);
                  }
                }
            }catch(error){
                console.warn("Video error: ", error);
            }
        }
    };

    //save content
    const saveToLibrary = async() => {
        let uri = videoUri ? videoUri : pictureUri;
        try {
            const asset = await MediaLibrary.createAssetAsync(uri);
            //save image to async storage (cache)
            saveImagesToAsync();
            launchStagingArea();
        } catch(error){
            console.log("create asset async: ", error);
        }

    };

    const saveImagesToAsync = async () => {
        try {
          await AsyncStorage.setItem("images", JSON.stringify(images));
          console.log(JSON.stringify(images));
        } catch (error) {
          console.log("Error storing images in asyncStorage: " + error);
        }
      };

    const launchStagingArea = async() => {
        console.log("Done button is hit");
        navigation.navigate("Upload");
      };

    const stopPress = () => {
        if(cameraRef.current){
            cameraRef.current.stopRecording();
            setIsVideoRecording(false);
            setIsPreview(true);
        }
    };

    const cancelPreview = async() =>{
        await cameraRef.current.resumePreview();
        setIsPreview(false);
        setPictureUri(null);
        setVideoUri(null);
    };

/******************** EVENT RENDERS ******************************************************************************/
    const renderPicturePreview = () => (
        <View style={styles.previewContainer}>
            <TouchableOpacity onPress={cancelPreview}>
                <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveToLibrary}>
                <Text style={styles.text}>Done</Text>
            </TouchableOpacity>
        </View>
    );

    const renderVideoPlayback = () => (
        <View style={styles.mediaContainer}>
            <View style={styles.previewContainer}>
                <TouchableOpacity onPress={cancelPreview}>
                    <Text style={styles.text}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveToLibrary}>
                    <Text style={styles.text}>Done</Text>
                </TouchableOpacity>
            </View>
            <Video
                source={{ uri: videoUri }}
                shouldPlay={true}
                isLooping
                isMuted={true}
                style={styles.media}
            /> 
        </View>

    );
    
    const renderVideoRecording = () => (
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
                onPressOut={stopPress}
                onPress={takePicture}
                style={styles.capture}
            />
        </View>
    );


    return(
        <View style={styles.container}>
        <Camera
          ref={cameraRef}
          type={cameraType}
          style={styles.container}
          flashMode={Camera.Constants.FlashMode.off}
          onCameraReady={onCameraReady}
          onMountError={(error) => {
            console.log("camera error", error);
          }}
        />
        <View style={styles.container}>
            { !isPreview && !pictureUri && !videoUri && renderCaptureControl() }
            { isPreview && !videoUri && pictureUri && renderPicturePreview() } 
            { isVideoRecording && renderVideoRecording() }
            { isPreview && !pictureUri && videoUri && renderVideoPlayback() }
        </View>
      </View>
    );
}
/******************** STYLES **************************************************************************************/   

const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
    },
    media:{
        flex:1
    },
    previewContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20
    },
    mediaContainer:{
        backgroundColor: '#333',
        flexDirection: 'column',
        flex:1,
    },
    recordIndicatorContainer:{
        flexDirection: "row",
        position: "absolute",
        top: 25,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        opacity: 0.7,
    },
    recordDot:{
        borderRadius: 3,
        height: 6,
        width: 6,
        backgroundColor: "#ff0000",
        marginHorizontal: 5,
    },
    recordTitle:{
        fontSize: 20,
        color: "#ffffff",
        textAlign: "center",
    },
    control: {
        position: "absolute",
        flexDirection: "row",
        bottom: 38,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    capture:{
        backgroundColor: "#f5f6f5",
        borderRadius: 5,
        height: captureSize,
        width: captureSize,
        borderRadius: Math.floor(captureSize / 2),
        marginHorizontal: 31,
    },
    text: {
        color: "#fff",
        fontSize: 17
    },
  });
