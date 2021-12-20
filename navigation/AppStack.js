import React from "react";
import {
    Image,
    TouchableOpacity
} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme } from "@react-navigation/native";

// screens
import { Home, OcrFunctions, FoodRecognition, FoodDetail, Login, CollectPersonal} from "./../screens/";
import { SignUp } from "./../screens";

import ViewListFood from "./../screens/ViewListFood";
// extra screens
import Tabs from "./../navigation/tabs";

import { icons, COLORS, SIZES } from './../constants';


const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const Stack = createStackNavigator();

const App = () => {
    return (
            <Stack.Navigator initialRouteName={'Home'}>

                <Stack.Screen
                    name="CollectPersonal"
                    component={CollectPersonal}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="OcrFunctions"
                    component={OcrFunctions}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="FoodRecognition"
                    component={FoodRecognition}
                    options={{ headerShown: false }}
                /> 

                <Stack.Screen
                    name="FoodDetail"
                    component={FoodDetail}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="ViewListFood"
                    component={ViewListFood}
                    options={{
                        title: " ",
                        headerStyle: {
                            backgroundColor: COLORS.white,
                            height: 60
                        },
                        headerLeft: ({ onPress }) => (
                            <TouchableOpacity
                                style={{ marginLeft: SIZES.padding ,marginTop: 40}}
                                onPress={onPress}
                            >
                                <Image
                                    source={icons.back}
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                    }}
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />   

                {/* Tabs */}
                < Stack.Screen
                    name="Home"
                    component={Tabs}
                    options={{
                        headerShown: false
                    }}
                />

            </Stack.Navigator>
    );
};

export default App;
