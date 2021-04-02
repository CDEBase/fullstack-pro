import React from "react"
import {StyleSheet, View, Text, ViewStyle} from "react-native"

interface Style {
    container: ViewStyle
}

const Calendar = () => {
    return (
        <View style={styles.container}>
            <Text>Calendar Value</Text>
        </View>
    )
}

const styles = StyleSheet.create<Style>({
    container:{
        textAlign: 'center'
    }
})

export default Calendar