import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "../styles/global";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FileSelector() {
  const numColumns = 2;
  const [images, setImages] = useState([]);
  const [viewWidth, setViewWidth] = useState(0);

  useEffect(() => {
    console.log("Images array: " + images);
    saveImagesToAsync();
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });
    console.log(result);
    await setImages((images) => [...images, result]);
  };

  const saveImagesToAsync = async () => {
    try {
      await AsyncStorage.setItem("images", JSON.stringify(images));
      console.log(JSON.stringify(images));
    } catch (error) {
      console.log("Error storing images in asyncStorage: " + error);
    }
  };

  return (
    <View
      style={globalStyles.container}
      onLayout={(event) => {
        setViewWidth(event.nativeEvent.layout.width);
      }}
    >
      <Button title="Pick an image or video" onPress={pickImage} />
      <FlatList
        data={images}
        numColumns={numColumns}
        keyExtractor={(item, index) => item.uri}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{ width: viewWidth / 2, height: viewWidth / 2 }}
          />
        )}
      />
    </View>
  );
}
