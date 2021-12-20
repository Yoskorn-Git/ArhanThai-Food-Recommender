import React, {useContext, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Button,
    ScrollView,
    Alert
} from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import { TagSelect } from 'react-native-tag-select';
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { AuthContext } from '../navigation/AuthProvider';
import database from '@react-native-firebase/database';

const SignUp = ({ navigation }) => {

    const [showPassword, setShowPassword] = useState(false)

    const [areas, setAreas] = useState([])
    const [selectedArea, setSelectedArea] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const { foodAllergy, setFoodAllergy } = useContext(AuthContext);
    const { register, setUserNameGlobal } = useContext(AuthContext)

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
                <Text style={{ marginLeft: SIZES.padding3 * 1.5, color: COLORS.black, ...FONTS.h2 }}>Register</Text>

            </View>
        )
    }

    function renderLogo() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding3 * 8,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={images.thaifood_1}
                    resizeMode="contain"
                    style={{
                        width: "80%"
                    }}
                />
            </View>
        )
    }

    function renderForm() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding3 * 3,
                    marginHorizontal: SIZES.padding3 * 3,
                }}
            >
                {/* Full Name */}
                <View style={{ marginTop: SIZES.padding3 * 3 }}>
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>User Name</Text>
                    <TextInput
                        style={{
                            marginVertical: SIZES.padding3,
                            borderBottomColor: COLORS.black,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        onChangeText={(userName) => setUserName(userName)}
                        placeholder="Enter User Name"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.gray}
                    />
                </View>
                
                {/* email */}
                <View style={{ marginTop: SIZES.padding3 * 3 }}>
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>E-mail</Text>
                    <TextInput
                        style={{
                            marginVertical: SIZES.padding3,
                            borderBottomColor: COLORS.black,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        onChangeText={(userEmail) => setEmail(userEmail)}
                        placeholder="Enter E-mail"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.gray}
                    />
                </View>

                {/* Phone Number */}
                {/* <View style={{ marginTop: SIZES.padding3 * 2 }}>
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>Phone Number</Text>

                    <View style={{ flexDirection: 'row' }}>

                        <TouchableOpacity
                            style={{
                                width: 100,
                                height: 50,
                                marginHorizontal: 5,
                                borderBottomColor: COLORS.black,
                                borderBottomWidth: 1,
                                flexDirection: 'row',
                                ...FONTS.body2
                            }}
                            onPress={() => setModalVisible(true)}
                        >
                            <View style={{ justifyContent: 'center' }}>
                                <Image
                                    source={icons.down}
                                    style={{
                                        width: 10,
                                        height: 10,
                                        tintColor: COLORS.black
                                    }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                                <Image
                                    source={{ uri: selectedArea?.flag }}
                                    resizeMode="contain"
                                    style={{
                                        width: 30,
                                        height: 30
                                    }}
                                />
                            </View>

                            <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                                <Text style={{ color: COLORS.black, ...FONTS.body3 }}>{selectedArea?.callingCode}</Text>
                            </View>
                        </TouchableOpacity>

                        <TextInput
                            style={{
                                flex: 1,
                                marginVertical: SIZES.padding3,
                                borderBottomColor: COLORS.black,
                                borderBottomWidth: 1,
                                height: 40,
                                color: COLORS.black,
                                ...FONTS.body3
                            }}
                            placeholder="Enter Phone Number"
                            placeholderTextColor={COLORS.gray}
                            selectionColor={COLORS.gray}
                        />
                    </View>
                </View> */}

                {/* Password */}
                <View style={{ marginTop: SIZES.padding3 * 2 }}>
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>Password</Text>
                    <TextInput
                        style={{
                            marginVertical: SIZES.padding3,
                            borderBottomColor: COLORS.black,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        onChangeText={(userPassword) => setPassword(userPassword)}
                        placeholder="Enter Password"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.gray}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 10,
                            height: 30,
                            width: 30
                        }}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Image
                            source={showPassword ? icons.disable_eye : icons.eye}
                            style={{
                                height: 20,
                                width: 20,
                                tintColor: COLORS.black
                            }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View>
                    <TextInput
                        style={{
                            marginVertical: SIZES.padding3,
                            borderBottomColor: COLORS.black,
                            borderBottomWidth: 1,
                            height: 40,
                            color: COLORS.black,
                            ...FONTS.body3
                        }}
                        placeholder="Confirm Password"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.gray}
                    />
                </View>
                
            </View>
        )
    }

    function renderTagSelect() {
    
        const data = [
            { id: 1, label: 'Cow’s Milk' },
            { id: 2, label: 'Eggs' },
            { id: 3, label: 'Tree Nuts' },
            { id: 4, label: 'Peanuts' },
            { id: 5, label: 'Shellfish' },
            { id: 6, label: 'Wheat' },
            { id: 7, label: 'Soy' },
            { id: 8, label: 'Fish' },
          ];

        return (
            <View style={{
                marginTop: SIZES.padding3 * 3,
                marginHorizontal: SIZES.padding3 * 3,
            }}>
                <Text style={{ color: COLORS.black, ...FONTS.body3, marginBottom: 20 }}>Allergic food</Text>

                <TagSelect
                    itemStyle={styles.item}
                    itemLabelStyle={styles.label}
                    itemStyleSelected={styles.itemSelected}
                    itemLabelStyleSelected={styles.labelSelected}
                    data={data}
                    ref={(tag) => {
                    this.tag = tag;
                    }}
                />
            </View>
          );
    }

    function renderButton() {
        return (
            <View style={{ margin: SIZES.padding3 * 3 }}>
                
                <TouchableOpacity
                    style={[{ 
                        marginTop: SIZES.padding / 5 , 
                        width: '100%',
                        height: 60,
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
                    onPress={async() => {
                        setUserNameGlobal(userName)
                        register(email, password); 
                        
                        let allergyArr = [];
                        for(i=0;i<this.tag.itemsSelected.length;i++){ 
                            allergyArr[i] = this.tag.itemsSelected[i].label
                        }
                        
                        console.log(allergyArr);
                        setFoodAllergy(allergyArr)
                    }}
                >
                <LinearGradient
                    style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}
                    colors={[COLORS.aiforthai, COLORS.aiforthai_light1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    >
                        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Sign Up</Text>
                    </LinearGradient>
                    
                </TouchableOpacity>

                <View style={{ flexDirection : 'row', justifyContent : 'flex-end', marginTop : 10}}>
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>Already have account? </Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("Login")}
                        >
                        <Text style={{ color: COLORS.purple, ...FONTS.body3 }}>Sign in</Text>
                    </TouchableOpacity>
                </View>
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
                <ScrollView>
                    {renderHeader()}
                    {renderForm()}
                    {renderTagSelect()}
                    {renderButton()}
                </ScrollView>
            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default SignUp;

const styles = StyleSheet.create({

    buttonContainer: {
      padding: 15,
    },
    buttonInner: {
      marginBottom: 15,
    },
    labelText: {
      color: '#333',
      fontSize: 15,
      fontWeight: '500',
      marginBottom: 15,
    },
    item: {
      borderWidth: 0.5,
      borderRadius: 15,
      borderColor: COLORS.gray,    
      backgroundColor: COLORS.white,
    },
    label: {
      color: '#333'
    },
    itemSelected: {
      backgroundColor: COLORS.aiforthai,
    },
    labelSelected: {
      color: '#FFF',
    },
  });