import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/Home";
import Gallery from "../screens/Gallery";
import Camera from "../screens/CameraVideo";
import Upload  from "../screens/Upload";

//key-value pairs
//Object-screen component
const screens = {
  Home: {
    screen: Home, //show Home screen component
  },
  Gallery: {
    screen: Gallery,
  },
  Camera: {
    screen: Camera,
  },
  Upload: {
    screen: Upload,
  }
};

//create a new stack navigator for the given screens
const HomeStack = createStackNavigator(screens);

//wrap into a component that can be rendered in App.js
export default createAppContainer(HomeStack);
