import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native"
import { RNCamera } from 'react-native-camera'
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-crop-picker';
import ImageEditor from "@react-native-community/image-editor";

const Scan = ({ navigation }) => {

    const [methodScan, setMethodScan] = useState("image")
    const [isLoading, setIsloading] = useState(false)
    const [testImage, setImage] = useState()
    const [foundMenu, setFoundMenu] = useState(false)
    
    async function foodImageRecognition(image) {
        let jsonData = await APIfoodImage(image);

        console.log(jsonData);
        console.log(jsonData.objects[0].lable)

        navigation.navigate("FoodDetail", {
            foodName : jsonData.objects[0].result
          })  
    }

    const APIfoodImage = async(data) => {
        //POST request 
        let resultFoodNameData = await fetch('https://api.aiforthai.in.th/thaifood', {
            method: 'POST', //Request Type
            body: `{ "file" : "${data}" }` , //post body
            headers: {
                'Content-Type': 'application/json',
                'apikey': INSERT_AIFORTHAI_KEY,
            },
            })
        
        let resultFoodNameJson = await resultFoodNameData.json();

        return resultFoodNameJson
    };

    const APIimageToText = async(data) => {
        let resultMenuData = await fetch("https://vision.googleapis.com/v1/images:annotate?key=" + INSERT_GOOGLE_KEY, {
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

          return resultMenuData;
    }

    const foodMenuOcr = async(data) => {
        let result = await APIimageToText(data)
    
        let foodList = filterStringResult(JSON.stringify(result.responses[0].fullTextAnnotation.text));
        
        console.log(foodList.length);
        if(foodList.length == 0){   // Check Food List if can't found
            alert("We can't detect any menu")
            navigation.navigate("Scan")
        }else{
            navigation.navigate("ViewListFood", {
            foodList : foodList
        })
        }
    }

    function filterStringResult(resultString) {
        var res = resultString.split(/['\\n', ' ', '/', '"']+/);
        var food = [];
    
        for (const index in res) {
            if(/^[ก-๙]+$/ig.test(res[index])){ ///Check Thai Letter only
                //console.warn(res[index])
                food.push(res[index])
            }
        }
    
        console.log(food);
        return food;
    }

    const choosePhotoFromLibrary = async() => {

        let image = await ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: false
        })

        let data = await RNFetchBlob.fs.readFile(image.path, 'base64')
        


        if(methodScan == "image")
            foodImageRecognition(data)
        else
            foodMenuOcr(data)
    }

    function renderHeader() {

        const textHeader = () => {
            if(methodScan == "image"){
                return(
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Scan for Food image</Text>
                    </View>
                    
                )
            }else{
                return(
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Scan for Food Menu list</Text>
                    </View>
                )
            }
        }
        

        return (
            <View style={{ flexDirection: 'row', marginTop: 10 * 4, paddingHorizontal: 10 * 3 }}>
                <TouchableOpacity
                    style={{
                        width: 45,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Image
                        source={icons.close}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>
                    
                {textHeader()}

                <TouchableOpacity
                    style={{
                        height: 45,
                        width: 45,
                        backgroundColor: COLORS.aiforthai_light1,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => console.log("Info")}
                >
                    <Image
                        source={icons.info} //####################### icons.info
                        style={{
                            height: 24,
                            width: 24,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderScanFocusFood() {
        if(methodScan == "image"){
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View style={{
                                marginTop: "-55%",
                                width: 350,
                                height: 350
                            }}>
                        <Image
                            source={images.focus}
                            resizeMode="stretch"
                            style={{
                                width: 350,
                                height: 350
                            }}
                        />

                        <Image
                            source={images.thaifood_1}
                            resizeMode="stretch"
                            style={{
                                width: 350,
                                height: 350,
                                position: 'absolute',
                                opacity: 0.1
                            }}
                        />
                    </View>
                </View>
            )
        } else if(methodScan == "menuList"){
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View style={{
                                marginTop: "-55%",
                                width: 300,
                                height: 450
                            }}>
                        <Image
                            source={images.focus}
                            resizeMode="stretch"
                            style={{
                                width: 300,
                                height: 450
                            }}
                        />

                        <Image
                            source={images.doc_icon}
                            resizeMode="stretch"
                            style={{
                                position: 'absolute',
                                marginTop: 20,
                                opacity: 0.1,
                                width: 300,
                                height: 400
                            }}
                        />                        
                    </View>
                    
                </View>
            )
        }
    }

    function SelectScanMethods() {
        if(methodScan == 'image'){
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-around',
                        marginTop: 15,
                        
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: COLORS.lightpurple,
                            borderRadius: 10,
                            paddingRight: 10,
                        }}
                        onPress={() => {
                            console.log("Food Image")
                            setMethodScan("image")
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightpurple,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={icons.food2}
                                resizeMode="cover"
                                style={{
                                    height: 25,
                                    width: 25,
                                    tintColor: COLORS.purple
                                }}
                            />
                        </View>
                        <Text style={{ marginLeft: 10, ...FONTS.body4 }}>Food Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 10 * 2,
                            paddingRight: 10,
                        }}
                        onPress={() => {
                            console.log("Menu List")
                            setMethodScan("menuList")
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightGreen,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={icons.doc}
                                resizeMode="cover"
                                style={{
                                    height: 25,
                                    width: 25,
                                    tintColor: COLORS.primary
                                }}
                            />
                        </View>
                        <Text style={{ marginLeft: 10, ...FONTS.body4 }}>Menu list</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if(methodScan == "menuList"){
            return(
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-around',
                        marginTop: 15,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 10,
                            paddingRight: 10,
                        }}
                        onPress={() => {
                            console.log("Food Image")
                            setMethodScan("image")
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightpurple,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                            }}
                        >
                            <Image
                                source={icons.food2}
                                resizeMode="cover"
                                style={{
                                    height: 25,
                                    width: 25,
                                    tintColor: COLORS.purple
                                }}
                            />
                        </View>
                        <Text style={{ marginLeft: 10, ...FONTS.body4 }}>Food Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 10 * 2,
                            borderRadius: 10,
                            paddingRight: 10,
                            backgroundColor: COLORS.lightGreen
                        }}
                        onPress={() => {
                            console.log("Menu List")
                            setMethodScan("menuList")
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightGreen,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={icons.doc}
                                resizeMode="cover"
                                style={{
                                    height: 25,
                                    width: 25,
                                    tintColor: COLORS.primary
                                }}
                            />
                        </View>
                        <Text style={{ marginLeft: 10, ...FONTS.body4 }}>Menu list</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    function renderScanMethods() {
        return (
            <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 300,
                    padding: 20 ,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}>

                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 240,
                        padding: 20 ,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        backgroundColor: COLORS.white
                    }}
                    >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                        }}
                        onPress={() => {
                            choosePhotoFromLibrary()
                            console.log("Choose from lib")
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: COLORS.lightGray,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={icons.image}
                                resizeMode="cover"
                                style={{
                                    height: 35,
                                    width: 35,
                                    tintColor: COLORS.aiforthai
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    
                    <Text style={{ ...FONTS.h5, alignSelf: 'center'}}>What would you like to scan?</Text>
                    
                    <SelectScanMethods/>

                </View>

                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        onPress={this.takePicture.bind(this)} 
                        style={styles.capture}
                        >
                            <Image 
                                source={icons.camera}
                                // source={{uri: `data:image/jpg;base64,${testImage}`}}
                                // source={{uri: testImage}}
                                resizeMode="contain"
                                    style={{
                                        height: 40,
                                        width: 40,
                                        marginTop: 5,
                                        tintColor: COLORS.aiforthai
                                    }}>

                                </Image>
                    </TouchableOpacity>
                </View>
            </View>
            
        )
    }

    const PendingView = () => (
        <View
          style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Waiting</Text>
        </View>
      );
    
    const [mode, setMode] = useState("contain")
    const [onlyScaleDown, setOnlyScaleDown] = useState(false)

    takePicture = async () => {
        if(methodScan == "image"){
            if (this.camera) {
                const options = { 
                    quality: 0.1, 
                    base64: true,
                    width: 500
                     };
                const data = await this.camera.takePictureAsync(options);
                setImage(data.base64);
                
                const cropData = {
                    offset: {x: 0, y: 220},
                    size: {width: 500, height: 500},
                    resizeMode: 'stretch'
                  };

                const croppedImageURI = await ImageEditor.cropImage({uri: `data:image/jpg;base64,${data.base64}`}, cropData)
                setImage(croppedImageURI);

                console.log(croppedImageURI);
                
                let imageCropped = await RNFetchBlob.fs.readFile(croppedImageURI.slice(7), 'base64')
                // console.log(imageCropped);
                
                foodImageRecognition(imageCropped);

                // console.log(dataa);
            }
        }
        else if(methodScan == "menuList"){
            if (this.camera) {
                const options = { 
                    quality: 0.1, 
                    base64: true,
                    width: 500
                     };
                const data = await this.camera.takePictureAsync(options);
                setImage(data.base64);
                
                const cropData = {
                    offset: {x: 50, y: 200},
                    size: {width: 400, height: 550},
                    resizeMode: 'stretch'
                  };

                const croppedImageURI = await ImageEditor.cropImage({uri: `data:image/jpg;base64,${data.base64}`}, cropData)
                setImage(croppedImageURI);

                console.log(croppedImageURI);
                
                let imageCropped = await RNFetchBlob.fs.readFile(croppedImageURI.slice(7), 'base64')

                foodMenuOcr(imageCropped)
            }
        }
      };

      return (
        <View style={styles.container}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
          >
            {renderHeader()}
            {renderScanFocusFood()}
          </RNCamera>
            {renderScanMethods()}
        </View>
      );
}

export default Scan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        backgroundColor: COLORS.white,
        width: 80,
        height: 80,
        borderRadius: 80/2,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
  });