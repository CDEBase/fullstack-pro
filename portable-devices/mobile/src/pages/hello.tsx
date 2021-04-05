import React from "react"
import {StyleSheet, View, Text, ViewStyle} from "react-native"

interface Style {
    container: ViewStyle
}

const Hello = () => {
    return (
        <View style={styles.container}>
            <Text>Hello Value</Text>
        </View>
    )
}

const styles = StyleSheet.create<Style>({
    container: {
        textAlign: 'center'
    }
})

export default Hello