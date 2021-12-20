import React, {useContext} from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { AuthContext } from '../navigation/AuthProvider';
import database from '@react-native-firebase/database';
import Swiper from 'react-native-swiper'

const Home = ({navigation}) => {

    const featuresData = [
        {
            id: 1,
            icon: icons.food2,
            color: COLORS.purple,
            backgroundColor: COLORS.lightyellow,
            description: "Scan Food"
        },
        {
            id: 2,
            icon: icons.doc,
            color: COLORS.blue,
            backgroundColor: COLORS.lightyellow,
            description: "Scan Menu"
        },
    ]

    const specialPromoData = [
        {
            id: 1,
            img: "https://a.cdn-hotels.com/gdcs/production73/d1742/496b95ba-5a96-4728-84c5-f5abf8ce763d.jpg",
            title: "Papaya salad",
            description: "Don't miss it"
        },
        {
            id: 2,
            img: "https://i2.wp.com/www.tielandtothailand.com/wp-content/uploads/2017/03/Chicken-Laab-Laab-Gai.jpg?resize=1000%2C563&ssl=1",
            title: "Spicy meat salad",
            description: "Don't miss it"
        },
        {
            id: 3,
            img: "https://theplanetd.com/images/thai-food-fish-dish.jpg",
            title: "Steamed fish with herbs ",
            description: "Don't miss it"
        },
        {
            id: 4,
            img: "https://static.wixstatic.com/media/f50806_3c2f7c9ef7df4742aa99d4d3e183c793.jpg/v1/fill/w_1000,h_563,al_c,q_90,usm_0.66_1.00_0.01/f50806_3c2f7c9ef7df4742aa99d4d3e183c793.jpg",
            title: "Tom Yum Kung",
            description: "Don't miss it"
        },
    ]

    const [features, setFeatures] = React.useState(featuresData)
    const [specialPromos, setSpecialPromos] = React.useState(specialPromoData)
    const [userName, setUserName] = React.useState("Error")

    const { user } = useContext(AuthContext);

    function isNewUser() {

        database()
            .ref(`/users/${user.uid}/startRating`)
            .once("value", snapshot => {
                if (snapshot.exists()){
                    console.log("User exists!");
                 }
                else {
                    console.log("Creating New User");
                    navigation.navigate("CollectPersonal")
                }
            })
            // .then(() => console.log('Data set. UID:' + user.uid));
    }

    function renderHeader() {
        database()
            .ref(`/users/${user.uid}/userName`)
            .once("value")
            .then(snapshot => {
                console.log(snapshot.val());
                setUserName(snapshot.val());
              });

        return (
            <View style={{ flexDirection: 'row', marginVertical: SIZES.padding * 1 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h1 }}>Are you hungry ?</Text>
                    <Text style={{ ...FONTS.body2, color: COLORS.gray }}>{userName}</Text>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={{
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.lightGray,
                            borderRadius: 100
                        }}
                    >
                        <Image
                            source={icons.bell}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.aiforthai
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                height: 10,
                                width: 10,
                                backgroundColor: COLORS.red,
                                borderRadius: 5
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    function renderBanner() {
        return (
        <View style={styles.sliderContainer}>
            <Swiper
                autoplay
                horizontal={false}
                height={200}
                activeDotColor={COLORS.aiforthai}>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/images/food/thai-food1.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/images/food/thai-food2.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/images/food/thai-food3.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/images/food/thai-food4.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/images/food/thai-food5.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/images/food/thai-food6.jpg')}
                        resizeMode="cover"
                        style={styles.sliderImage}
                    />
                </View>
            </Swiper>
        </View>
        )
    }

    function renderFeatures() {

        const Header = () => (
            <View style={{ marginBottom: SIZES.padding / 2 }}>
                <Text style={{ ...FONTS.h3 }}>Features</Text>
            </View>
        )

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding , width: 80, alignItems: 'center' }}
                onPress={() => {
                    console.log(item.description)
                    if(item.description == "Scan Food")
                        navigation.navigate("Scan", {
                            method: "image",
                        });
                    else{
                        navigation.navigate("Scan", {
                            method: "menuList",
                        });
                    }
                }}
            >
                <View
                    style={{
                        height: 50,
                        width: 50,
                        marginBottom: 5,
                        borderRadius: 20,
                        backgroundColor: item.backgroundColor,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={item.icon}
                        resizeMode="contain"
                        style={{
                            height: 25,
                            width: 25,
                            tintColor: item.color
                        }}
                    />
                </View>
                <Text style={{ textAlign: 'center', flexWrap: 'wrap', ...FONTS.body4 }}>{item.description}</Text>
            </TouchableOpacity>
        )

        return (
            <FlatList
                ListHeaderComponent={Header}
                data={features}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-around' }}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                style={{ marginTop: SIZES.padding }}
            />
        )
    }

    function renderPromos() {

        const HeaderComponent = () => (
            <View>
                {renderHeader()}
                {renderBanner()}
                {renderFeatures()}
                {renderPromoHeader()}
            </View>
        )

        const renderPromoHeader = () => (
            <View
                style={{
                    flexDirection: 'row',
                    marginBottom: 10
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3 }}>Trading Meal</Text>
                </View>
                <TouchableOpacity
                    onPress={() => console.log("View All")}
                >
                    <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>View All</Text>
                </TouchableOpacity>
            </View>

        )

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    marginVertical: SIZES.base,
                    width: SIZES.width / 2.5
                }}
                onPress={() => console.log(item.title)}
            >
                <View
                    style={{
                        height: 80,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: COLORS.aiforthai
                    }}
                >
                    <Image
                        source={{uri : item.img}}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: "100%",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                        }}
                    />
                </View>

                <View
                    style={{
                        padding: 5,
                        backgroundColor: COLORS.lightGray,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20
                    }}
                >
                    <Text style={{ ...FONTS.h4, alignSelf: 'center'  }}>{item.title}</Text>
                    <Text style={{ ...FONTS.body4, marginTop :10, alignSelf: 'center' }}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                ListHeaderComponent={HeaderComponent}
                contentContainerStyle={{ paddingHorizontal: SIZES.padding * 1 }}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                data={specialPromos}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={{ marginBottom: 80 }}>
                    </View>
                }
            />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            {isNewUser()}
            {renderPromos()}
        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    sliderContainer: {
      height: 160,
      width: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 20,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: 20,
    },
    sliderImage: {
      height: '100%',
      width: '100%',
      alignSelf: 'center',
      borderRadius: 20,
    },

  });