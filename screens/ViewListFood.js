import React, {Component} from 'react'
import {StyleSheet, 
        Text, 
        View, 
        TouchableOpacity, 
        Image, 
        FlatList, 
        ActivityIndicator} from 'react-native'
import database from '@react-native-firebase/database'
import { AuthContext } from '../navigation/AuthProvider';
import { images, icons, COLORS, FONTS, SIZES } from '../constants';

class List extends Component {
    static contextType = AuthContext

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            foodList: [],
            recommendedList: []
        }
    }

    componentDidMount(){
        const { route } = this.props;
        const { foodList } = route.params;
        const { navigation } = this.props;
        const { user } = this.context

        fetch(`https://new-api-pc.herokuapp.com/firstRecommend/${user.uid}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: this.state.isLoading,
                    foodList: this.state.foodList,
                    recommendedList: responseJson
                })
            })
            .catch((error) => {
                console.error(error);
            });



        for (const key in foodList) {
            database()
            .ref(`/menu/${foodList[key]}`)
            .once('value')
            .then(snapshot => {
                if(snapshot.val() != null){
                    let info = {
                        "key" : foodList[key],
                        "title": snapshot.val().eng_name,
                        "url": snapshot.val().image,
                        "rate": snapshot.val().avg_rate
                    }

                    var joined = this.state.foodList.concat(info)

                    this.setState({
                        isLoading: false,
                        foodList: joined,
                        recommendedList: this.state.recommendedList
                    })
                }
            });
        }
        
        // console.log(foodCount);
        // if(foodCount == 0){
        //     alert("Sorry! We can't found any menu in our database")
        //     this.props,navigation.navigate("Scan")
        // }

    } 

    _renderItem = ({item, index}, rate) => {
        const {cardText, card, cardImage, recommended, cardRate, cardInfo} = styles
        const { navigation } = this.props;
        
        StarReview = ({ rate }) => {
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
        
        for (i=0 ; i<this.state.recommendedList.length; i++ ) {
            if(item.key == this.state.recommendedList[i]){
                return(
                    <TouchableOpacity style={card}
                        onPress={() => {
                            this.props,navigation.push("FoodDetail", {
                                foodName : item.key
                              }) 
                        }}
                    >
                        <View>
                            <Image style={cardImage} source={{uri: item.url}}></Image>
                            <View style={recommended}>
                                <Image style={{height: 50, width:50, alignSelf:'center'}} source={images.recommended}></Image>
                                <Text style={{color: COLORS.black, backgroundColor: COLORS.white, alignSelf:'center', borderRadius: 20}}>Recommended</Text>
                            </View>
                            
                        </View>
                        
                        <View style={cardInfo}>
                            <View>
                                <Text style={cardText}>{item.title}</Text>
                            </View>
                            
                            <View style={cardRate}>
                                <StarReview
                                    rate={item.rate}
                                />
                            </View>
                        </View>
                        
                        
                    </TouchableOpacity>
                )
            }
        }

        return(
            <TouchableOpacity style={card}
                onPress={() => {
                    this.props,navigation.push("FoodDetail", {
                        foodName : item.key
                        }) 
                }}
            >
                <View>
                    <Image style={cardImage} source={{uri: item.url}}></Image>
                    {/* <View style={recommended}>
                        <Image style={{height: 50, width:50, alignSelf:'center'}} source={images.recommended}></Image>
                        <Text style={{color: COLORS.black, backgroundColor: COLORS.white}}>Recommended</Text>
                    </View> */}
                    
                </View>
                
                <View style={cardInfo}>
                    <View>
                        <Text style={cardText}>{item.title}</Text>
                    </View>
                    
                    <View style={cardRate}>
                        <StarReview
                            rate={item.rate}
                        />
                    </View>
                </View>
                
                
            </TouchableOpacity>
        )

    }
    
    render() {
        let {container, headerText} = styles
        let {isLoading, foodList} = this.state
        //console.log(this.state.foodList);
        
        if(isLoading){
            return(
                <View style={{marginTop: 320}}>
                    <ActivityIndicator size="large" animating></ActivityIndicator>
                    <Text style={{ ...FONTS.body2, color: COLORS.gray, alignSelf: 'center',marginTop: 20 }}>If this take too long, please try again</Text>
                </View>
            )
        }

        else{
            return(
                <View style={{backgroundColor: COLORS.white}}>
                    <View style={{marginRight: 20, margin: 10, marginTop: 0, alignItems:'flex-end'}}>
                        <Text style={{ ...FONTS.h1 }}>Enjoy your Meal</Text>
                        <Text style={{ ...FONTS.body2, color: COLORS.gray }}>Here, what we found in your menu.</Text>
                    </View>

                    <View style={container}>
                        <FlatList 
                            data={foodList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderItem}
                        ></FlatList>
                    </View>
                </View>
                
            )
        }
    }
}

export default List

const styles = StyleSheet.create({
    container:{
        marginBottom : '30%',
    },
    cardInfo:{
        fontSize: 18,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    cardText:{
        fontSize: 18, 
    },
    card:{
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom :18,
        marginLeft: '5%',
        width: '90%',
        shadowColor: COLORS.gray,
        shadowOpacity: 1,
        shadowOffset:{
            width: 2,
            height: 2
        }
    },
    cardImage: {
        borderRadius: 20,
        width: '100%',
        height: 180,
        resizeMode: 'cover'
    },
    recommended: {
        alignSelf: 'flex-end',
        margin: 10,
        height: 100,
        width: 100,
        resizeMode: 'cover',
        position: 'absolute'
    },
    headerText: {
        fontSize: 18,
        padding: 10,
        textAlign: 'center'
    },
})