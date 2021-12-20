
import React, { Component, useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database'
import { AirbnbRating } from 'react-native-ratings';
import { AuthContext } from '../navigation/AuthProvider';
import { images, icons, COLORS, FONTS, SIZES } from '../constants';
import { FoodDetail } from '.';

const ShowFoodDetail = ({route, navigation}) => {

    const StarReview = ({ rate }) => {
        var starComponents = [];
        var fullStar = Math.floor(rate)
        var noStar = Math.floor(5 - rate)
        var halfStar = 5 - fullStar - noStar
    
        // Full Star
        for (var i = 0; i < fullStar; i++) {
            starComponents.push(
                <Image
                    key={`full-${i}`}
                    source={icons.starFull}
                    resizeMode="cover"
                    style={{
                        width: 20,
                        height: 20,
                    }}
                />
            )
        }
    
        // Half Star
        for (var i = 0; i < halfStar; i++) {
            starComponents.push(
                <Image
                    key={`half-${i}`}
                    source={icons.starHalf}
                    resizeMode="cover"
                    style={{
                        width: 20,
                        height: 20,
                    }}
                />
            )
        }
    
        // No Star
        for (var i = 0; i < noStar; i++) {
            starComponents.push(
                <Image
                    key={`empty-${i}`}
                    source={icons.starEmpty}
                    resizeMode="cover"
                    style={{
                        width: 20,
                        height: 20,
                    }}
                />
            )
        }
    
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {starComponents}
                <Text style={{ marginLeft: SIZES.base, color: COLORS.gray, ...FONTS.body3 }}>{rate}</Text>
            </View>
        )
    }
    
    const IconLabel = ({ icon, label }) => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={icon}
                    resizeMode="cover"
                    style={{
                        width: 50,
                        height: 50,
                    }}
                />
                <Text style={{ marginTop: SIZES.padding/2, color: COLORS.gray, ...FONTS.h3 }}>{label}</Text>
            </View>
        )
    }

    const [isLoading, setIsloading] = useState(true);
    const [foodInfo, setFoodInfo] = useState(null);
    const [foodAllergy, setFoodAllergy] = useState([]);
    const [riskyIngre, setRiskyIngre] = useState([]);
    const [isUserCanEat, setIsUserCanEat] = useState(true);

    const { foodName } = route.params;
    const { user } = useContext(AuthContext);
    //console.log(user.uid);

    //console.log(`Deteil Page : ${JSON.stringify(foodName)}`)
    let rawName = JSON.stringify(foodName).replace(/"/g,"");

    const databaseManage = () => {

            database()
            .ref(`/users/${user.uid}/foodAllergy`)
            .once('value')
            .then(snapshot => {
                    let arrFoodAllergy = [];

                    for(i=0; i<Object.values(snapshot.val()).length; i++){
                        arrFoodAllergy[i] = Object.values(snapshot.val())[i];
                    }
                    
                    setFoodAllergy(arrFoodAllergy)
            });
        
        if(foodInfo == null)
            database()
                .ref(`/menu/${rawName}`)
                .once('value')
                .then(snapshot => {
                    // console.log('DATA : ', snapshot.val());
                    if(snapshot.val() != null){
                        setFoodInfo(snapshot.val());
                        setIsloading(false)
                        let arrRisky = [];

                        for(i=0; i<Object.values(snapshot.val().risky_ingredients).length; i++){
                            arrRisky[i] = Object.values(snapshot.val().risky_ingredients)[i];
                        }
                        setRiskyIngre(arrRisky)

                    }else{
                        console.log("Not Found in Database");
                        alert(`We can't find (${rawName}) in the database.`)
                        navigation.goBack()
                    }
                    
                });      
    }

        const Eatable = () => {
            var isCanEat = true;
            var showRiskyIng = [];

            console.log("User Food Allergy :" + foodAllergy);
            console.log("Danger Food in this meal :" + riskyIngre);

            for(i=0;i<foodAllergy.length;i++){
                for(j=0;j<riskyIngre.length;j++){
                    if(foodAllergy[i]==riskyIngre[j]){
                        console.log("Cant Eat :" + foodAllergy[i]);
                        showRiskyIng = showRiskyIng.concat(foodAllergy[i]);
                        isCanEat = false;
                    }
                }
            }

            return(
                isCanEat ?
                <IconLabel
                    icon={icons.safe}
                    label="Eatable"
                /> : 
                <View style={{ alignItems: 'center' }}>
                <Image
                    source={icons.unsafe}
                    resizeMode="cover"
                    style={{
                        width: 50,
                        height: 50,
                    }}
                />
                <Text style={{ marginTop: SIZES.padding/2, color: COLORS.red, ...FONTS.h6 }}>May contain</Text>
                <Text style={{ color: COLORS.gray, ...FONTS.h3 }}>{showRiskyIng}</Text>
            </View>
            )
        }
            
        
        if(isLoading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator size="large" animating></ActivityIndicator>
                    {databaseManage()}
                </View>
            )
        }

        else{
            return (
                
                <View style={styles.container}>
                    {/* Header */}
                    <View style={{ flex: 1.5 }}>
                        <Image
                            source={{
                                uri: foodInfo.image_BG,
                            }}
                            resizeMode="cover"
                            style={{
                                width: '100%',
                                height: '80%',
                            }}
                        />
                        <View
                            style={[{
                                position: 'absolute',
                                bottom: "5%",
                                left: "5%",
                                right: "5%",
                                borderRadius: 15,
                                padding: SIZES.padding,
                                backgroundColor: COLORS.white
                            }, styles.shadow]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.shadow}>
                                    <Image
                                        source={{
                                            uri: foodInfo.image,
                                        }}
                                        resizeMode="cover"
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 15,
                                        }}
                                    />
                                </View>

                                <View style={{ marginHorizontal: SIZES.radius, justifyContent: 'space-around' }}>
                                    <Text style={{ ...FONTS.h2 }}> {foodInfo.eng_name} </Text>
                                    <Text style={{ color: COLORS.gray, ...FONTS.body3 }}> { foodInfo.reading_name}</Text>

                                    <StarReview
                                        rate={foodInfo.avg_rate}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: SIZES.radius }}>
                                <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>
                                    { foodInfo.short_about }
                                </Text>
                            </View>
                        </View>

                        {/* Header Buttons */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 50,
                                left: 20,
                                right: 20,
                                //height: 50,
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => { navigation.goBack() }}
                                >
                                    <Image
                                        source={icons.back}
                                        resizeMode="cover"
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    onPress={() => { console.log("Menu on pressed") }}
                                >
                                    <Image
                                        source={icons.menu}
                                        resizeMode="cover"
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Body */}
                    <ScrollView style={{ flex: 0.5 }}>
                        {/* Icons */}
                        <View style={{ flexDirection: 'row', marginTop: SIZES.base, paddingHorizontal: SIZES.padding * 2, justifyContent: 'space-between' }}>
                            <IconLabel
                                icon={icons.chili}
                                label={"Level " + foodInfo.taste.spicy_lvl}
                            />

                            <Eatable />

                            <IconLabel
                                icon={icons.calories}
                                label={foodInfo.avg_calories + " kcal"}
                            />
                        </View>

                        {/* About */}
                        <View style={{ marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}>
                            <Text style={{ ...FONTS.h2 }}>About</Text>
                            <Text style={{ marginTop: SIZES.radius, color: COLORS.gray, ...FONTS.body3 }}>
                                { foodInfo.about }
                            </Text>
                        </View>

                        {/* Footer */}
                        <View style={{ flex: 0.5, paddingHorizontal: SIZES.padding, marginTop: 30, marginBottom: 30 }}>

                            <Text style={{ ...FONTS.h2 }}>Rate this menu</Text>

                            <LinearGradient
                                style={[{ height: 100, width: '100%', borderRadius: 15, marginTop: SIZES.radius}]}
                                colors={['#edf0fc', '#d6dfff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf:'center', marginBottom: 10 }}>
                                    
                                    <AirbnbRating
                                        count={5}
                                        reviews={["Don't Pick This Up", "Just did not like it", "Mixed fellings", "Enjoyed it!", "New faverite!"]}
                                        defaultRating={0}
                                        size={30}
                                        />

                                    {/* <View style={{ flex: 1, marginHorizontal: SIZES.padding, justifyContent: 'center' }}>
                                        <Text style={{ ...FONTS.h2 }}>AVG 35 Bath</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{ width: 130, height: '80%', marginHorizontal: SIZES.radius }}
                                        onPress={() => { console.log(foodInfo)}}
                                    >
                                        <LinearGradient
                                            style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }]}
                                            colors={['#46aeff', '#5884ff']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Like</Text>
                                        </LinearGradient>
                                    </TouchableOpacity> */}
                                </View>
                            </LinearGradient>
                        </View>
                    </ScrollView>                  
                </View>
            
            );

        }
            
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

export default ShowFoodDetail;

// export default DestinationDetail;

// import React, { Component, useState, useContext } from 'react';
// import {
//     StyleSheet,
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     ActivityIndicator,
//     ScrollView
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import database from '@react-native-firebase/database'
// import { AirbnbRating } from 'react-native-ratings';
// import { AuthContext } from '../navigation/AuthProvider';
// import { images, icons, COLORS, FONTS, SIZES } from '../constants';
// import { FoodDetail } from '.';

// const ShowFoodDetail = () => {

// }

// const StarReview = ({ rate }) => {
//     var starComponents = [];
//     var fullStar = Math.floor(rate)
//     var noStar = Math.floor(5 - rate)
//     var halfStar = 5 - fullStar - noStar

//     // Full Star
//     for (var i = 0; i < fullStar; i++) {
//         starComponents.push(
//             <Image
//                 key={`full-${i}`}
//                 source={icons.starFull}
//                 resizeMode="cover"
//                 style={{
//                     width: 20,
//                     height: 20,
//                 }}
//             />
//         )
//     }

//     // Half Star
//     for (var i = 0; i < halfStar; i++) {
//         starComponents.push(
//             <Image
//                 key={`half-${i}`}
//                 source={icons.starHalf}
//                 resizeMode="cover"
//                 style={{
//                     width: 20,
//                     height: 20,
//                 }}
//             />
//         )
//     }

//     // No Star
//     for (var i = 0; i < noStar; i++) {
//         starComponents.push(
//             <Image
//                 key={`empty-${i}`}
//                 source={icons.starEmpty}
//                 resizeMode="cover"
//                 style={{
//                     width: 20,
//                     height: 20,
//                 }}
//             />
//         )
//     }

//     return (
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             {starComponents}
//             <Text style={{ marginLeft: SIZES.base, color: COLORS.gray, ...FONTS.body3 }}>{rate}</Text>
//         </View>
//     )
// }

// const IconLabel = ({ icon, label }) => {
//     return (
//         <View style={{ alignItems: 'center' }}>
//             <Image
//                 source={icon}
//                 resizeMode="cover"
//                 style={{
//                     width: 50,
//                     height: 50,
//                 }}
//             />
//             <Text style={{ marginTop: SIZES.padding/2, color: COLORS.gray, ...FONTS.h3 }}>{label}</Text>
//         </View>
//     )
// }

// const FoodDatabaseRequest = async(name) =>{

//     let rawName = name.replace(/"/g,"");

//     let foodInfo
    
//     await database()
//         .ref(`/menu/${rawName}`)
//         .once('value')
//         .then(snapshot => {
//             console.log('DATA : ', snapshot.val());
//             foodInfo = snapshot.val()
//         });

//     return foodInfo;               
// }

// export default class DestinationDetail extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             isLoading: true,
//             foodInfo: [],
//             foodAllergy: [],
//             isUserCanEat: true
//         }
//     }
//     static contextType = AuthContext

//     componentDidMount() {
//         const { route } = this.props;
//         const { foodName } = route.params;
//         const { navigation } = this.props;
//         console.log(`Deteil Page : ${JSON.stringify(foodName)}`)
//         let rawName = JSON.stringify(foodName).replace(/"/g,"");

//         const { user } = this.context

//         console.log(user.uid);

//         database()
//             .ref(`/users/${user.uid}/foodAllergy`)
//             .once('value')
//             .then(snapshot => {
//                 this.setState({
//                     isLoading: this.state.isLoading,
//                     foodInfo: this.state.foodInfo,
//                     foodAllergy: snapshot.val(),
//                     isUserCanEat: this.state.isUserCanEat
//                 })
//             });

//         database()
//             .ref(`/menu/${rawName}`)
//             .once('value')
//             .then(snapshot => {
//                 console.log('DATA : ', snapshot.val());
//                 if(snapshot.val() != null){
//                     this.setState({
//                         isLoading: false,
//                         foodInfo: snapshot.val(),
//                         foodAllergy: this.state.foodAllergy,
//                         isUserCanEat: this.state.isUserCanEat
//                     })
//                 }else{
//                     console.log("Not Found in Database");
//                     alert(`We can't find (${rawName}) in the database.`)
//                     navigation.goBack()
//                 }
                
//             });

//     }
    
//     render(){

//         const { foodAllergy } = this.state
//         const { navigation } = this.props;

//         let { foodInfo, isLoading } = this.state

//         // console.log("User Food Allergy :" + foodAllergy[0]);
//         // console.log("Danger Food in this meal :" + foodInfo.risky_ingredients);

//         let strRisky = JSON.stringify(foodInfo.risky_ingredients);
//         console.log(strRisky);
//         // for(i=0;i<foodAllergy.length;i++){
//         //     for(j=0;j<foodInfo.risky_ingredients.length;j++){
//         //         if(foodAllergy[i]==foodInfo.risky_ingredients[j]){
//         //             console.log("NOPE" + foodAllergy[i]);
//         //         }
//         //     }
//         // }

//         if(isLoading){
//             return(
//                 <View style={styles.container}>
//                     <ActivityIndicator size="large" animating></ActivityIndicator>
//                 </View>
//             )
//         }

//         else{
//             return (
                
//                 <View style={styles.container}>
//                     {/* Header */}
//                     <View style={{ flex: 1.5 }}>
//                         <Image
//                             source={{
//                                 uri: foodInfo.image_BG,
//                             }}
//                             resizeMode="cover"
//                             style={{
//                                 width: '100%',
//                                 height: '80%',
//                             }}
//                         />
//                         <View
//                             style={[{
//                                 position: 'absolute',
//                                 bottom: "5%",
//                                 left: "5%",
//                                 right: "5%",
//                                 borderRadius: 15,
//                                 padding: SIZES.padding,
//                                 backgroundColor: COLORS.white
//                             }, styles.shadow]}
//                         >
//                             <View style={{ flexDirection: 'row' }}>
//                                 <View style={styles.shadow}>
//                                     <Image
//                                         source={{
//                                             uri: foodInfo.image,
//                                         }}
//                                         resizeMode="cover"
//                                         style={{
//                                             width: 70,
//                                             height: 70,
//                                             borderRadius: 15,
//                                         }}
//                                     />
//                                 </View>

//                                 <View style={{ marginHorizontal: SIZES.radius, justifyContent: 'space-around' }}>
//                                     <Text style={{ ...FONTS.h2 }}> {foodInfo.eng_name} </Text>
//                                     <Text style={{ color: COLORS.gray, ...FONTS.body3 }}> { foodInfo.reading_name}</Text>

//                                     <StarReview
//                                         rate={foodInfo.avg_rate}
//                                     />
//                                 </View>
//                             </View>

//                             <View style={{ marginTop: SIZES.radius }}>
//                                 <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>
//                                     { foodInfo.short_about }
//                                 </Text>
//                             </View>
//                         </View>

//                         {/* Header Buttons */}
//                         <View
//                             style={{
//                                 position: 'absolute',
//                                 top: 50,
//                                 left: 20,
//                                 right: 20,
//                                 //height: 50,
//                                 flexDirection: 'row',
//                             }}
//                         >
//                             <View style={{ flex: 1 }}>
//                                 <TouchableOpacity
//                                     onPress={() => { navigation.goBack() }}
//                                 >
//                                     <Image
//                                         source={icons.back}
//                                         resizeMode="cover"
//                                         style={{
//                                             width: 30,
//                                             height: 30,
//                                         }}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                             <View style={{ flex: 1, alignItems: 'flex-end' }}>
//                                 <TouchableOpacity
//                                     onPress={() => { console.log("Menu on pressed") }}
//                                 >
//                                     <Image
//                                         source={icons.menu}
//                                         resizeMode="cover"
//                                         style={{
//                                             width: 30,
//                                             height: 30,
//                                         }}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>

//                     {/* Body */}
//                     <ScrollView style={{ flex: 0.5 }}>
//                         {/* Icons */}
//                         <View style={{ flexDirection: 'row', marginTop: SIZES.base, paddingHorizontal: SIZES.padding * 2, justifyContent: 'space-between' }}>
//                             <IconLabel
//                                 icon={icons.chili}
//                                 label={"Level " + foodInfo.taste.spicy_lvl}
//                             />

//                             <IconLabel
//                                 icon={icons.safe}
//                                 label="Eatable"
//                             />

//                             <IconLabel
//                                 icon={icons.calories}
//                                 label={foodInfo.avg_calories + " kcal"}
//                             />
//                         </View>

//                         {/* About */}
//                         <View style={{ marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}>
//                             <Text style={{ ...FONTS.h2 }}>About</Text>
//                             <Text style={{ marginTop: SIZES.radius, color: COLORS.gray, ...FONTS.body3 }}>
//                                 { foodInfo.about }
//                             </Text>
//                         </View>

//                         {/* Footer */}
//                         <View style={{ flex: 0.5, paddingHorizontal: SIZES.padding, marginTop: 30, marginBottom: 30 }}>

//                             <Text style={{ ...FONTS.h2 }}>Rate this menu</Text>

//                             <LinearGradient
//                                 style={[{ height: 100, width: '100%', borderRadius: 15, marginTop: SIZES.radius}]}
//                                 colors={['#edf0fc', '#d6dfff']}
//                                 start={{ x: 0, y: 0 }}
//                                 end={{ x: 1, y: 0 }}
//                             >
//                                 <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf:'center', marginBottom: 10 }}>
                                    
//                                     <AirbnbRating
//                                         count={5}
//                                         reviews={["Don't Pick This Up", "Just did not like it", "Mixed fellings", "Enjoyed it!", "New faverite!"]}
//                                         defaultRating={0}
//                                         size={30}
//                                         />

//                                     {/* <View style={{ flex: 1, marginHorizontal: SIZES.padding, justifyContent: 'center' }}>
//                                         <Text style={{ ...FONTS.h2 }}>AVG 35 Bath</Text>
//                                     </View>

//                                     <TouchableOpacity
//                                         style={{ width: 130, height: '80%', marginHorizontal: SIZES.radius }}
//                                         onPress={() => { console.log(foodInfo)}}
//                                     >
//                                         <LinearGradient
//                                             style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }]}
//                                             colors={['#46aeff', '#5884ff']}
//                                             start={{ x: 0, y: 0 }}
//                                             end={{ x: 1, y: 0 }}
//                                         >
//                                             <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Like</Text>
//                                         </LinearGradient>
//                                     </TouchableOpacity> */}
//                                 </View>
//                             </LinearGradient>
//                         </View>
//                     </ScrollView>                  
//                 </View>
               
//             );

//         }
//     }

        
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.white
//     },
//     shadow: {
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,

//         elevation: 5,
//     }
// });

// // export default DestinationDetail;
