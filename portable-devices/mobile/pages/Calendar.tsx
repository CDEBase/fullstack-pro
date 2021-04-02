import React from "react"
import {StyleSheet, View, Text, ViewStyle} from "react-native"
import { Calendar } from 'react-native-big-calendar'

interface Style {
    container: ViewStyle
}

const events = [
    {
      title: 'Meeting',
      start: new Date("2021-04-02T12:00:00Z"),
      end: new Date("2021-04-02T16:30:00Z"),
    },
    {
      title: 'Coffee break',
      start: new Date("2021-04-02T17:00:00Z"),
      end: new Date("2021-04-02T17:30:00Z"),
    },
    {
        title: 'Lunch',
        start: new Date("2021-04-03T17:00:00Z"),
        end: new Date("2021-04-03T18:00:00Z"),
      },
]

const CalendarScreen = () => {
    return (
        <View style={styles.container}>
            <Calendar events={events} height={600} />
        </View>
    )
}

const styles = StyleSheet.create<Style>({
    container:{
        textAlign: 'center'
    }
})

export default CalendarScreen