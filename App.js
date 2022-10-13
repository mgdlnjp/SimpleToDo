import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Keyboard,
  Alert,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    var date = ("0" + new Date().getDate()).slice(-2); //Current Date
    var month = ("0" + (new Date().getMonth() + 1)).slice(-2); //Current Month
    var year = new Date().getFullYear(); //Current Year

    setCurrentDate(date + "/" + month + "/" + year);
  }, []);

  // AJOUTER -----------

  async function addTask() {
    const search = task.filter((task) => task === newTask);

    if (search.length !== 0) {
      Alert.alert("Attention, cette tâche existe déjà!");
      return;
    }

    if (newTask == "") {
      Alert.alert("Attention ⛔", "Veuillez ajouter une nouvelle tâche.");
      return;
    }

    setTask([...task, newTask]);
    setNewTask("");

    Keyboard.dismiss();
  }

  // EFFACER ---------------

  async function removeTask(item) {
    Alert.alert(
      "Attention ⛔",
      "Voulez-vous vraiment effacer la tâche?",
      [
        {
          text: "Annuler",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "Effacer",
          onPress: () => {
            setTask(task.filter((tasks) => tasks !== item));
          },
        },
      ],
      { cancelable: false }
    );
  }

  // PERSISTENCE DES DONNEES ---------------

  useEffect(() => {
    async function loadDate() {
      const task = await AsyncStorage.getItem("task");

      if (task) {
        setTask(JSON.parse(task));
      }
    }
    loadDate();
  }, []);

  useEffect(() => {
    async function saveData() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    saveData();
  }, [task]);

  // APPCONTENT --------------------------

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isEnabled ? "#1E1E1E" : "#f4f3f4" },
      ]}
    >
      <View
        style={[
          styles.body,
          { backgroundColor: isEnabled ? "#1E1E1E" : "#f4f3f4" },
        ]}
      >
        <StatusBar backgroundColor={isEnabled ? "#1E1E1E" : "#f4f3f4"} />

        <View style={styles.navbar}>

          <Text
            style={[styles.title, { color: isEnabled ? "#f4f3f4" : "#1E1E1E" }]}
          >
            Liste du {currentDate}
          </Text>

        


          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={isEnabled ? "#f4f3f4" : "#1E1E1E"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />


        </View>

        <FlatList
          style={styles.flatList}
          data={task}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => removeTask(item)}>
              <View
                style={[
                  styles.taskView,
                  { borderColor: isEnabled ? "#f4f3f4" : "#1E1E1E" },
                ]}
              >
                <Text
                  style={[
                    styles.taskText,
                    { color: isEnabled ? "#f4f3f4" : "#1E1E1E" },
                  ]}
                >
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <View
          style={[
            styles.form,
            { backgroundColor: isEnabled ? "#f4f3f4" : "#1E1E1E" },
          ]}
        >
          <TextInput
            style={[styles.input, { color: isEnabled ? "#1E1E1E" : "#f4f3f4" }]}
            placeholder="Ajouter une nouvelle tâche"
            placeholderTextColor={isEnabled ? "#1E1E1E" : "#f4f3f4"}
            onChangeText={(text) => setNewTask(text)}
            value={newTask}
          />

          <TouchableOpacity style={styles.btn}>
            <Ionicons
              name="add-circle-outline"
              size={45}
              color={isEnabled ? "#1E1E1E" : "#f4f3f4"}
              onPress={() => addTask()}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// CSS --------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
    // margin: 15,
  },

  navbar: {
    justifyContent: "space-between",
    paddingTop: 5,
    paddingRight: 20,
    paddingLeft: 20,
    marginRight: 10,
    marginBottom: 10,
    width: "100%",
    //height: "13%",
    //justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
  },

  title: {
    //paddingBottom: 17,
    paddingTop: 23,
    fontSize: 20,
    fontWeight: "bold",
   // paddingRight: 75,
  },

  switch: {
      height: "147%",
    //paddingTop: "25%",
   // verticalAlign: "baseline",
    //justifyContent: "space-between",
  },

  form: {
    paddingTop: 5,
    paddingRight: 20,
    paddingLeft: 20,
    marginRight: 10,
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
  },

  input: {
    flex: 1,
    height: 50,
    width: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    border: "none",
    fontSize: 17,
  },

  btn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -4,
    marginTop: -0.5,
    paddingLeft: 2,
  },

  flatList: {
    flex: 1,
  },

  taskView: {
    padding: 20,
    height: 60,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  taskText: {
    fontSize: 17,
    fontWeight: "bold",
    paddingRight: 50,
    marginTop: -3,
  },
});
