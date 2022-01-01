import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from "./color";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const STORAGE_KEY = "@toDos";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  // Nico는 두개의 버튼을 만들고 토글처럼 사용할때 1개의 상태 + 2개의 setState를 사용
  // 2개의 setState는 반대의 boolean값을 인자로 넘겨줌
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  // RN에서 onChangeText 속성을 사용함.(not 'onChange')
  const onChangeText = (payload) => {
    setText(payload);
  };
  const saveToDos = async (toSave) => {
    // JSON.stringify : Object -> string
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, s);
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      // parse : string -> object
      const data = JSON.parse(s);
      if (data !== null) {
        setToDos(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    //save to do
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteAll = async () => {
    Alert.alert("Are you sure?", "delete All to Do!", [
      {
        text: "cancel",
      },
      {
        text: "OK",
        style: "destructive",
        onPress: async () => {
          const newToDos = {};
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };
  const deleteToDo = async (key) => {
    const newToDos = { ...toDos };
    delete newToDos[key];
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  console.log(toDos);
  console.log(SCREEN_HEIGHT, SCREEN_WIDTH);
  useEffect(() => {
    loadToDos();
  }, []);
  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

      <View style={styles.content}>
        <View style={styles.contentInput}>
          <TextInput
            value={text}
            onSubmitEditing={addToDo}
            onChangeText={onChangeText}
            returnKeyType="done"
            style={styles.input}
            placeholder={working ? "Add a to do" : "Where do you want to go?"}
            placeholderTextColor={theme.inputPlaceholder}
          />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="never"
          style={styles.contentList}
        >
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View key={key} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.footer} onPress={deleteAll}>
        <View>
          <Text style={styles.footerText}>DELETE ALL</Text>
        </View>
      </TouchableOpacity>
    </View>
    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 80,
    backgroundColor: theme.white,
  },
  content: { flex: 10, backgroundColor: theme.white },
  contentInput: { backgroundColor: theme.white },
  contentList: { backgroundColor: theme.white },

  footer: { flex: 1, backgroundColor: theme.white },
  footerText: {
    fontSize: 22,
    color: "red",
    textAlign: "center",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: theme.black,
  },
  input: {
    backgroundColor: theme.input,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 20,
  },
  list: { flex: 12, backgroundColor: "skyblue" },
  toDo: {
    backgroundColor: theme.toDoBgrd,
    marginVertical: 10,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: { fontSize: 16, fontWeight: "500", textAlign: "center" },
});
