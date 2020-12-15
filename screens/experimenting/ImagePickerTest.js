import React, { useEffect, useState } from "react";
import { StyleSheet, Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "../../styles/global";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ImagePickerTest() {
  const [images, setImages] = useState([]);
  const [storedImages, setStoredImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
    });
    setImages([...images, result]);
    saveImagesToAsync();
  };

  const saveImagesToAsync = async () => {
    try {
      await AsyncStorage.setItem("images", JSON.stringify(images));
      console.log(JSON.stringify(images));
    } catch (error) {
      console.log("Error storing images in asyncStorage: " + error);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("images");
      setStoredImages(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.log("Error retrieving data: " + e);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Button title="Pick image" onPress={pickImage} />
      <Button title="Display images" onPress={getData} />
      <FlatList
        data={storedImages}
        keyExtractor={(item, index) => item.uri}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
      />
    </View>
  );
}
