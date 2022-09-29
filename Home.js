import { StyleSheet, Text, View } from "react-native";

export default function Homepage() {
  return (
    <View stle={ StyleSheet.container }>
      <text>This will be the Home Page</text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});