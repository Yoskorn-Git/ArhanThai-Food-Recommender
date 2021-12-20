import React, { useState, useContext} from "react";
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
    Platform
} from "react-native"
import LinearGradient from 'react-native-linear-gradient'

import {AuthContext} from '../navigation/AuthProvider';
import { COLORS, SIZES, FONTS, icons, images } from "../constants"

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const {login} = useContext(AuthContext);

    const [showPassword, setShowPassword] = React.useState(false)
    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

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
                <Text style={{ marginLeft: SIZES.padding3 * 1.5, color: COLORS.black, ...FONTS.h2 }}>Sign in</Text>

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
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>Email</Text>
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
                        placeholder="Enter Email"
                        placeholderTextColor={COLORS.gray}
                        selectionColor={COLORS.gray}
                    />
                </View>
                
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
                
            </View>
        )
    }

    function renderButton() {
        return (
            <View style={{ margin: SIZES.padding3 * 3 }}>
                <TouchableOpacity
                    style={[{ 
                        marginTop: SIZES.padding , 
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
                    onPress={() => login(email, password)}
                >
                <LinearGradient
                    style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}
                    colors={[COLORS.aiforthai, COLORS.aiforthai_light1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    >
                        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Login</Text>
                    </LinearGradient>
                    
                </TouchableOpacity>

                <View style={{ flexDirection : 'row', justifyContent : 'flex-end', marginTop : 10}}>
                    <Text style={{ color: COLORS.black, ...FONTS.body3 }}>Don't have account? </Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("SignUp")}
                        >
                        <Text style={{ color: COLORS.purple, ...FONTS.body3 }}>Register</Text>
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
                <View>
                    {renderHeader()}
                    {renderLogo()}
                    {renderForm()}
                    {renderButton()}
                </View>
            </LinearGradient>
            {renderAreaCodesModal()} 
        </KeyboardAvoidingView>
    )
}

export default SignUp;

const styles = StyleSheet.create({
    scanner: {
      flex: 1,
      aspectRatio: undefined
    },
})