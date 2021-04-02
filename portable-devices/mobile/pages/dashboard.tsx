import React from "react"
import {StyleSheet, View, Text, ViewStyle} from "react-native"

interface Style {
    container: ViewStyle
}

const Dashboard = () => {
    return(
        <View style={styles.container}>
            <Text>Dashboard Value</Text>
        </View>
    )
}

const styles = StyleSheet.create<Style>({
    container:{
        textAlign: 'center'
    }
})

export default Dashboard