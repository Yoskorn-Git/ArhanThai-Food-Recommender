import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob'


const FoodRognition = ({ navigation }) => {

  const FoodRecognition = async() => {

    let data = await choosePhotoFromLibrary();

    if(data){
      let jsonData = await foodImageRecogniion(data);
      console.log(jsonData.objects[0].label)
      let foodName = jsonData.objects[0].label

      navigation.navigate("FoodDetail", {
        foodName : jsonData.objects[0].label
      })
    }
  }

  const takePhotoFormCamera = async() => {
      ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        }).then(image => {
          console.log("START");

        RNFetchBlob.fs.readFile(image.path, 'base64')
            .then(async (data) => {
              foodImageRecogniion(data);
            })
        });
    }

  const choosePhotoFromLibrary = async() => {

      let image = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false
        })

      return await base64Converter(image); 
    }

  const base64Converter = async(image) =>{

      return base64 = await RNFetchBlob.fs.readFile(image.path, 'base64')
    }
  

  const translateTHtoEN = async() => {
  //GET request
      var Text = "This function is only available on POSIX platforms (i.e. not Windows or Android). This feature is not available in Worker threads.";
      var encodedUrlText = encodeURI(Text);
      console.log(encodedUrlText);

      await fetch(`https://api.aiforthai.in.th/xiaofan-en-th/${encodedUrlText}` , {
          method: 'GET',
          headers: {
          //Header Defination
          'apikey':
              'DxnxAL5XDQsojsdn6XPfa2tzgXpW29US',
          }
      })
          .then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
          alert(JSON.stringify(responseJson));
          console.log(responseJson);
          })
          //If response is not in json then in error
          .catch((error) => {
          alert(JSON.stringify(error));
          console.error(error);
          });
          
          console.log('Done');
  };

  const foodImageRecogniion = async(data) => {

      //POST request 
      let resultFoodNameData = await fetch('https://api.aiforthai.in.th/thaifood', {
          method: 'POST', //Request Type
          body: `{ "file" : "${data}" }` , //post body
          headers: {
              'Content-Type': 'application/json',
              'apikey': 'DxnxAL5XDQsojsdn6XPfa2tzgXpW29US',
          },
          }) 
          // .then((response) => response.json())
          // //If response is in json then in success
          // .then((responseJson) => {
          //     alert(JSON.stringify(responseJson));
          //     console.log(responseJson);
          // })
          // //If response is not in json then in error
          // .catch((error) => {
          //     alert(JSON.stringify(error));
          //     console.error(error);
          // });

      let resultFoodNameJson = await resultFoodNameData.json();
      return resultFoodNameJson
  };

    return (
        <SafeAreaView style={{flex: 1}}>
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
                onPress={FoodRecognition}>
                <Text style={styles.textStyle}>
                  Choose photo form libraty
                </Text>
              </TouchableOpacity>
              {/*Running POST Request*/}
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={ () => { navigation.navigate("FoodDetail") } }>
                <Text style={styles.textStyle}>
                  API detect word form Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
}

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
});

export default FoodRognition;