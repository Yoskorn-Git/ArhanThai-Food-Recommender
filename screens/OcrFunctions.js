import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob'

const OCRfunctions = ({ navigation }) => {

  const {user, logout} = useContext(AuthContext);

  const takePhotoFormCamera = () => {
    ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
        setImage(image.path)
      });
  }

  async function choosePhotoFromLibrary() {

    ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false
      }).then(image => {
        console.log("START");

        RNFetchBlob.fs.readFile(image.path, 'base64')
          .then(async (data) => {
            console.log(data);
            let result = await checkForText(data)
            console.log(result);

            let filteredResult = filterResponse(result.responses[0]);

            let filteredStringResult = filterStringResult(JSON.stringify(filteredResult.text));

          })
        })
  }

  function filterStringResult(resultString) {
    var res = resultString.split(/['\\n', ' ', '/', '"']+/);
    console.log(res)

    for(key in res){
      if(!isNaN(res[key])){
        console.log(res[key])
        res.splice(key, 1)
      }
    }

    for(key in res){
      console.warn(res[key]);
    }
    
  }

  function filterResponse(response) {
    let text = response.fullTextAnnotation
    return text
  }

  async function checkForText(data) {
    return await
      fetch("https://vision.googleapis.com/v1/images:annotate?key=" + INSERT_GOOGLE_KEY, {
        method: "post",
        body: JSON.stringify({
              requests: [
                  {
                      image: {
                          content : data
                      },
                      features: [
                          { type : "TEXT_DETECTION"},
                      ],
                      // "imageContext": {
                      // "languageHints": ["th-t-i0-handwrit"]
                      // }
                  }
              ]
            }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
      }) 
        .then((response) => {
          return response.json();
        },
        (error) => {
          alert('promise rejected');
          console.error(error);
      });
  }

  async function textCleansing(text){

    await fetch(`https://api.aiforthai.in.th/textcleansing?text=${text}` , {
      method: 'GET',
      headers: {
        //Header Defination
        'apikey' : INSERT_AIFORTHAI_KEY,
      //  'Content-Type' : 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        //console.log(response);
        return response.json();

      }, (error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
  }
  
  
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <View style={styles.container}>
      <Image
        style={styles.stretch}
        source={{uri: image}}
      />
      </View> */}
      <View style={styles.container}>
        <View style={styles.container}>
        <TouchableOpacity
            style={styles.buttonStyle}
            onPress={takePhotoFormCamera}>
            <Text style={styles.textStyle}>
              Take a photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => logout()}>
            <Text style={styles.textStyle}>
              Choose photo form libraty
            </Text>
          </TouchableOpacity>
          {/*Running POST Request*/}
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={f => f}>
            <Text style={styles.textStyle}>
              API detect word form Photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },
  textStyle: {
    fontSize: 18,
    color: 'white',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#f4511e',
    padding: 10,
    marginVertical: 10,
  },
  stretch: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
  },
});

export default OCRfunctions;