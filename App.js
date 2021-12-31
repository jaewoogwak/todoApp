import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import theme from "./color";

export default function App() {
  // Nico는 두개의 버튼을 만들고 토글처럼 사용할때 1개의 상태 + 2개의 setState를 사용
  // 2개의 setState는 반대의 boolean값을 인자로 넘겨줌
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  // RN에서 onChangeText 속성을 사용함.(not 'onChange')
  const onChangeText = (payload) => {
    setText(payload);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity onPress={work}>
            <Text
              style={{
                ...styles.btnText,
                color: working ? theme.black : theme.grey,
              }}
            >
              Work
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={travel}>
            <Text
              style={{
                ...styles.btnText,
                color: working ? theme.grey : theme.black,
              }}
            >
              Travel
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            value={text}
            onChangeText={onChangeText}
            style={styles.input}
            placeholder={working ? "Add a to do" : "Where do you want to go?"}
            placeholderTextColor={theme.black}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: theme.black,
  },
  input: {
    backgroundColor: theme.input,
    // color: theme.black,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 20,
  },
});
