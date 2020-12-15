import React, { useState } from "react";
//import * as Font from 'expo-font';
//import { AppLoading } from 'expo';
import Navigator from "./routes/HomeStack";
import CameraVideo from "./screens/experimenting/CameraVideo";
import DocumentPickerTest from "./screens/experimenting/DocumentPickerTest";
import ImagePickerTest from "./screens/experimenting/ImagePickerTest";

export default function App() {
  return (
    //<Navigator/>
    //  <CameraVideo/>
    // <DocumentPickerTest/>
    <ImagePickerTest />
  );
}
