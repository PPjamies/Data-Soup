import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 


export default function UriItem({ item, removeItem }){

    return(
        <View style={styles.item}>
            <Image
                style={styles.tinyLogo}
                source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}/>
            <Text>{item.uri}</Text>
            <AntDesign 
                name="closecircleo"
                size={18}
                color="black"
                onPress={() => removeItem(item.uri)} />
        </View>
    )
}

const styles = StyleSheet.create({
    item:{
        padding: 16,
        marginTop: 16,
        borderColor: '#bbb',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee',
    },
    tinyLogo:{
        width: 30,
        height: 30,  
    }
});