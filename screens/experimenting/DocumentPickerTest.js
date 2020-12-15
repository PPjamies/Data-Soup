import React, { useState } from "react";
import { View, Image, Button, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { globalStyles } from "../../styles/global";

export default function DocumentPickerTest() {
  const [imageURI, setimageURI] = useState(
    "https://reactnative.dev/img/tiny_logo.png"
  );

  const getDocumentHandler = async () => {
    console.log("Finding doc");
    const docInfo = await DocumentPicker.getDocumentAsync();
    setimageURI(docInfo.uri);
  };

  return (
    <View style={styleSheet.view}>
      <View>
        <Button
          title="Search for image"
          onPress={async () => {
            getDocumentHandler();
            console.log("THis is the image" + imageURI);
          }}
        />
      </View>
      <View>
        <Image
          style={styleSheet.image}
          source={{
            uri: imageURI,
          }}
        />
      </View>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  view: {
    margin: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
});
