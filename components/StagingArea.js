import React, { useState } from 'react';
import { View, FlatList, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import UriItem from './UriItem';

export default function StagingArea(){
    const [label, setLabel] = useState('Enter a label');
    const [listOfUris, setListOfUris] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    //test
    const [tests, setTests] = useState([
        {uri: 'test1.jpg'},
        {uri: 'test2.jpg'},
        {uri: 'test3.jpg'},
        {uri: 'test4.jpg'},
        {uri: 'test5.jpg'},
        {uri: 'test6.jpg'},
        {uri: 'test7.jpg'},
        {uri: 'test8.jpg'},
        {uri: 'test9.jpg'},
        {uri: 'test10.jpg'}
    ]);

/******************** EVENT HANDLERS ******************************************************************************/

    const upload = async() => {
    //upload list of uris to back end for processing
    //re-render component to display uploading progress bar
    //await for response code:
        //200 success code displays succcess
        //other displays error
    }

    const removeItem = (uri) => {
        setTests((prevTests) => {
            return prevTests.filter(tests => tests.uri != uri);
        });
    }

    
/******************** EVENT RENDERS ******************************************************************************/

    const renderListItem = ({item}) => (
        <UriItem 
            item={item}
            removeItem={removeItem}/>
    );

    return(
        <View style={styles.outerContainer} >
            <View style={styles.innerContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={label}
                    onChangeText={(newLabel) => setLabel(newLabel)} />
                <View style={styles.content}>
                    <View style={styles.list}>
                        <FlatList
                            data={tests}
                            renderItem={renderListItem}
                            keyExtractor={(item) => item.uri}
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => upload} >
               <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
        </View>
    )
};

/******************** STYLES **************************************************************************************/   

const styles = StyleSheet.create({
    outerContainer:{
        flex:1,
        padding: 10,
        backgroundColor: '#f4b0dc',
        justifyContent: 'space-evenly'
    },
    innerContainer:{
        flex:1,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        flexGrow: 15
    },
    content:{
        flex: 1,
        marginTop: 30
    },
    list:{
        marginTop: 0
    },
    input: {
        marginTop: 80,
        fontSize: 24,
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        borderRadius: 10
    },
    button:{
        backgroundColor: '#35c63a',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        borderRadius: 40,
        marginBottom: 10
    },
    buttonText:{
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    }
});
