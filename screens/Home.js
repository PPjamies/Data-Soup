import React from "react";
import { View, Button } from "react-native";
import { globalStyles } from "../styles/global";

//Instead of passing in all of props to Home function
//destructure what we need from props - navigation
export default function Home({navigation}) {
  //when we configured navigation stack
  //every screen gets a navigation property
  //props.navigation

  const pressHandler = (option) => {
    if (option == "gallery") navigation.navigate("Gallery");
    else if (option == "camera") navigation.navigate("Camera");
  };

  return (
    <View styles={globalStyles.container}>
      <Button title="Gallery" onPress={() => pressHandler("gallery")} />
      <Button title="Camera" onPress={() => pressHandler("camera")} />
    </View>
  );
}
