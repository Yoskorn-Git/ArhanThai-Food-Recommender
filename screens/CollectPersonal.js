import React, {useState, useContext} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StatusBar,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    StyleSheet,
    SafeAreaView
} from "react-native"
import LinearGradient from 'react-native-linear-gradient'

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { AuthContext } from '../navigation/AuthProvider';
import database from '@react-native-firebase/database';

const SignUp = ({ navigation }) => {
    //const { userName } = route.params;
    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    const { user, userName, foodAllergy } = useContext(AuthContext);
    const [selectedId, setSelectedId] = useState([]);

    React.useEffect(() => {
        fetch("https://restcountries.eu/rest/v2/all")
            .then(response => response.json())
            .then(data => {
                let areaData = data.map(item => {
                    return {
                        code: item.alpha2Code,
                        name: item.name,
                        callingCode: `+${item.callingCodes[0]}`,
                        flag: `https://www.countryflags.io/${item.alpha2Code}/flat/64.png`
                    }
                })

                setAreas(areaData)

                if (areaData.length > 0) {
                    let defaultData = areaData.filter(a => a.code == "US")

                    if (defaultData.length > 0) {
                        setSelectedArea(defaultData[0])
                    }
                }
            })
    }, [])

    function renderHeader() {
        return (
            <View
                style={{
                    marginTop: 70,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Text style={{ marginLeft: SIZES.padding3 * 1.5, color: COLORS.black, ...FONTS.h2 }}>Choose Menu that you like</Text>
            </View>
        )
    }

    function renderFlatlist() {
        const DATA = [
            {
                id: "1",
                title: "Chicken Rice",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800291123507626034/O0.jpg"
            },
            {
                id: "2",
                title: "Chicken Coconut Soup",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800286790526828564/A0.jpg"
            },
            {
                id: "3",
                title: "Hot and Sour Prawn Soup",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290363755593748/B0.png"
            },
            {
                id: "4",
                title: "Fried Fish Cake",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290383019376660/SPOILER_C0.jpg"
            },
            {
                id: "5",
                title: "Stir Fried Pork with Basil",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290395246428181/D0.jpg"
            },
            {
                id: "6",
                title: "Stir-fried Rice Noodles",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290397582655488/E0.jpg"
            },
            {
                id: "7",
                title: "Chicken Panang Curry",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290733869367346/H0.jpg"
            },
            {
                id: "8",
                title: "Tofu Soup",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290429395927080/L0.jpg"
            },
            {
                id: "9",
                title: "Massaman Curry",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290420285767680/I0.jpg"
            },
            {
                id: "10",
                title: "Thai sour curry with young melon and Dok Khae",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290431657181205/M0.jpg"
            },
            {
                id: "11",
                title: "Green curry",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290714406879242/N0.jpg"
            },
            {
                id: "12",
                title: "Pad Thai",
                image: "https://cdn.discordapp.com/attachments/800285048879448074/800290771356876800/G0.jpg"
            },
            // {
            //     id: "13",
            //     title: "Third Item",
            //     image: 
            // },
            // {
            //     id: "14",
            //     title: "Third Item",
            //     image: 
            // }         

          ];

        const Item = ({ item, onPress, styleContainer }) => (
            <TouchableOpacity 
                onPress={onPress} 
                style={[styles.GridViewContainer, styleContainer]}
                >
                <Image 
                        style={[styles.cardImage]} 
                        source={{uri: item.image}}>
                    </Image>
                <View>
                    <Text style={styles.GridViewTextLayout}>{item.title}</Text>
                </View>
                
            </TouchableOpacity>
        );
        
        const renderItem = ({ item }) => {
            const backgroundColor = selectedId.includes(item.id) ? COLORS.aiforthai_light1 : COLORS.white;
            const opacity = selectedId.includes(item.id) ? 0.5 : 1;

            const removeId = (arr,value)=> {
                arr = arr.filter(val => val !== value);
                setSelectedId(arr)
            }
        
            return (
            <Item
                item={item}
                onPress={() => { 
                    selectedId.includes(item.id) ? removeId(selectedId, item.id) : setSelectedId([...selectedId, item.id]);
                    }

                }
                styleContainer={{ backgroundColor, opacity }}
                styleImage={{}}
            />
            );
        };

        return (
            <SafeAreaView 
                style={{marginTop: 10,
                        marginBottom: 100,
                        }}
                >
                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                    numColumns={2}
                />
            </SafeAreaView>
            
        );

    }

    function renderButton() {
        return (
            <View style={{marginRight: 40}}>
                <TouchableOpacity
                    style={[{ 
                        width: '100%',
                        height: 60,
                        margin: 20, 
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                
                        elevation: 5,
                }]}
                    onPress={() => {

                        database()
                            .ref(`/users/${user.uid}`)
                            .set({
                                userName: userName,
                                startRating : selectedId,
                                foodAllergy : foodAllergy
                            })
                            .then(() => {
                                console.log('Data set.')
                                fetch(`https://new-api-pc.herokuapp.com/updateUser`)
                            });

                        navigation.navigate("Home")}
                    }
                >
                <LinearGradient
                    style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}
                    colors={[COLORS.aiforthai, COLORS.aiforthai_light1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    >
                        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Done</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            
        )
    }

    function renderAreaCodesModal() {

        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{ padding: SIZES.padding3, flexDirection: 'row' }}
                    onPress={() => {
                        setSelectedArea(item)
                        setModalVisible(false)
                    }}
                >
                    <Image
                        source={{ uri: item.flag }}
                        style={{
                            width: 30,
                            height: 30,
                            marginRight: 10
                        }}
                    />
                    <Text style={{ ...FONTS.body4 }}>{item.name}</Text>
                </TouchableOpacity>
            )
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View
                            style={{
                                height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.blue,
                                borderRadius: SIZES.radius
                            }}
                        >
                            <FlatList
                                data={areas}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.code}
                                showsVerticalScrollIndicator={false}
                                style={{
                                    padding: SIZES.padding3 * 2,
                                    marginBottom: SIZES.padding3 * 2
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={[COLORS.white, COLORS.lightGreen]}
                style={{ flex: 1 }}
            >
                <View style={{flex: 1}}>
                    {renderHeader()}
                    {renderFlatlist()}
                </View>
                <View>
                    {renderButton()}
                </View>
            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#e5e5e5"
      },
    headerText: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        fontWeight: "bold"
      },
    GridViewContainer: {
        borderWidth: 0.5,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        margin: 7,
        backgroundColor: '#7B1FA2',
        opacity: 1,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowOffset:{
            width: 2,
            height: 1
        }
    },
    GridViewTextLayout: {
       fontSize: 13,
       fontWeight: 'bold',
       justifyContent: 'center',
       color: COLORS.black,
       padding: 10,
     },
     cardImage: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        height: 255,
        resizeMode: 'cover'
    },
});