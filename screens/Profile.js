import React, {useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import LinearGradient from 'react-native-linear-gradient'

const ProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>UID: {user.uid}</Text>
      <View style={{ margin: SIZES.padding3 * 3 }}>
                <TouchableOpacity
                    style={[{ 
                        marginTop: SIZES.padding / 5 , 
                        width: 200,
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
                    onPress={() => {logout()}}
                >
                <LinearGradient
                    style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}
                    colors={[COLORS.aiforthai, COLORS.aiforthai_light1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    >
                        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Log Out</Text>
                    </LinearGradient>
                    
                </TouchableOpacity>
                
            </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
});
