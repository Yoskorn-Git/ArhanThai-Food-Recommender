
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ActionSheetIOS
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob'

import { images, icons, COLORS, FONTS, SIZES } from '../constants';
import { LongPressGestureHandler } from 'react-native-gesture-handler';

const takePhotoFormCamera = async() => {
    let image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
    })

    return await base64Converter(image);
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


const OptionItem = ({ bgColor, icon, label, onPress }) => {

    return (
        <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 250, marginTop: 50}}
            onPress={onPress}
        >
            <View style={[styles.shadow, { width: 200, height: 200 }]}>
            
                <LinearGradient
                    style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: 'red' }]}
                    colors={bgColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <Image
                        source={icon}
                        resizeMode="cover"
                        style={{
                            tintColor: COLORS.white,
                            width: 100,
                            height: 100,
                        }}
                    />
                </LinearGradient>
            </View>
            <Text style={{ marginTop: SIZES.base, color: COLORS.gray, ...FONTS.body3 }}>{label}</Text>
        </TouchableOpacity>
    )
}

const foodMenuOcr = async(data) => {
    let result = await checkForText(data)

    let foodList = filterStringResult(JSON.stringify(result.responses[0].fullTextAnnotation.text));

    return foodList
}

function filterStringResult(resultString) {
    var res = resultString.split(/['\\n', ' ', '/', '"']+/);

    var food = [];

    // for (const index in res) {
    //     console.log(res[index]);
    // }

    for (const index in res) {
        if(/^[ก-๙]+$/ig.test(res[index])){ ///Check Thai Letter only
            //console.warn(res[index])
            food.push(res[index])
        }
    }

    console.log(food);
    return food;
}

async function checkForText(data) {
    return await
      fetch("https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyBvBorv6a6PqNdSHlRUInrTFy8LJdXHOGQ", {
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
        'apikey' : 'DxnxAL5XDQsojsdn6XPfa2tzgXpW29US',
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

const ChooseFunction = ({ navigation }) => {

    const FoodRecognition = async(type) => {

        let data

        if(type == "Camera")
            data = await takePhotoFormCamera();
        else    
            data = await choosePhotoFromLibrary();

        if(data){
          let jsonData = await foodImageRecogniion(data);
          console.log(jsonData.objects[0].label)    
          navigation.navigate("FoodDetail", {
            foodName : jsonData.objects[0].label
          })
        }
    }

    const MenuOcr = async(type) => {
        let data

        if(type == "Camera")
            data = await takePhotoFormCamera();
        else    
            data = await choosePhotoFromLibrary();

        if(data){
          let foodList = await foodMenuOcr(data);
          navigation.navigate("ViewListFood", {
            foodList : foodList
          })
        }
    }

    const actionSheet = (func) =>
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ["Cancel", "Take a photo", "Pick from library"],
            //destructiveButtonIndex: 2,
            cancelButtonIndex: 0
        },
        async buttonIndex => {
            if (buttonIndex === 0) {
            // cancel action
            } else if (buttonIndex === 1 && func == "Function 1") {
                console.log("A");
                FoodRecognition("Camera");
            } else if (buttonIndex === 2 && func == "Function 1") {
                console.log("B");
                FoodRecognition("Library");
            } else if (buttonIndex === 1 && func == "Function 2") {
                MenuOcr("Camera");
            } else if (buttonIndex === 2 && func == "Function 2") {
                MenuOcr("Library");
            }
        }
        );

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', marginTop:100 }}>
                <View style={{ flexDirection: 'column', marginTop: SIZES.padding, paddingHorizontal: SIZES.base }}>
                    <OptionItem
                        icon={icons.eat}
                        bgColor={['#46aeff', '#5884ff']}
                        onPress={() => {console.log("Pressed");}}
                        onPress={() => { actionSheet("Function 1") }}
                    />
                    <OptionItem
                        icon={icons.scan}
                        bgColor={['#fddf90', '#fcda13']}
                        onPress={() => {console.log("Pressed");}}
                        onPress={() => { actionSheet("Function 2") }}
                    />
                </View>
            </View>
        </View>
        
     )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
});

export default ChooseFunction;
