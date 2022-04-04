import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { AntDesign, Fontisto } from "@expo/vector-icons";

export default function App() {
  const [working, setWorking] = useState();
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  const [editing, setEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  let todoKey = "";
  useEffect(() => {
    getTodos();
    getWorking();
  }, []);

  const study = () => {
    setWorking(false);
    const workingValue = false;
    saveWorking(workingValue);
  };
  const work = () => {
    setWorking(true);
    const workingValue = true;
    saveWorking(workingValue);
  };
  const onChangeText = (payload) => {
    setText(payload);
  };

  // Remember which tap was used lasttime
  const saveWorking = async (workingValue) => {
    try {
      await AsyncStorage.setItem("@working", workingValue.toString());
    } catch (e) {
      console.log("error from saveWorking", e);
    }
  };
  const getWorking = async () => {
    try {
      const workingValue = await AsyncStorage.getItem("@working");
      return workingValue === "true" ? setWorking(true) : setWorking(false);
    } catch (e) {
      console.log("error from getWorking", e);
    }
  };

  // Save & Load from Storage
  const saveTodos = async (toSave) => {
    try {
      const json = JSON.stringify(toSave);
      await AsyncStorage.setItem("@todos", json);
    } catch (e) {
      console.log("error from saveTodos", e);
    }
  };
  const getTodos = async () => {
    try {
      const json = await AsyncStorage.getItem("@todos");
      return json != null ? setTodos(JSON.parse(json)) : null;
    } catch (e) {
      console.log("error from getTodos", e);
    }
  };

  // Add new Todos
  const addTodo = () => {
    if (text === "") {
      return;
    }
    const newTodos = {
      ...todos,
      [Date.now()]: { text, working, completed: false },
    };
    setTodos(newTodos);
    saveTodos(newTodos);
    setText("");
  };

  // Delete each Todo
  const deleteTodo = (key) => {
    Alert.alert("Delete Todo ,", "ARE YOU SURE?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);
        },
      },
    ]);
  };

  // Complete Todo
  const completeTodo = (key) => {
    const newTodos = { ...todos };
    newTodos[key] = { ...newTodos[key], completed: !newTodos[key].completed };
    setTodos(newTodos);
    saveTodos(newTodos);
    console.log(newTodos[key]);
  };

  // Edit Todo fixing ㅠㅠ Help Me!!!

  // const editClick = (key) => {
  //   setCurrentTodo({ ...todos[key] });
  //   setEditing(true);
  // };
  // const editTodo = (event) => {
  //   const newTodos = [...todos];
  //   console.log(event.target.text);
  //   setEditing(false);
  //   // setTodos(newTodos);
  //   // saveTodos(newTodos);
  // };

  // remove Every Todos
  const clearAll = () => {
    Alert.alert("Clear All ,", "ARE YOU SURE?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTodos({});
          saveTodos({});
        },
      },
    ]);
  };

  return (
    // Header
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              color: theme.light,
              fontSize: 36,
              fontWeight: "600",
              color: working ? "white" : theme.fade,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={study}>
          <Text
            style={{
              color: theme.light,
              fontSize: 36,
              fontWeight: "600",
              color: !working ? "white" : theme.fade,
            }}
          >
            Study
          </Text>
        </TouchableOpacity>
      </View>

      {/* text input new Todo & edit Todo*/}
      {editing ? (
        <TextInput
          onChangeText={onChangeText}
          onSubmitEditing={(event) => editTodo(event)}
          defaultValue={currentTodo.text}
          value={text}
          placeholder="Edit todo"
          style={styles.input}
        />
      ) : (
        <TextInput
          onChangeText={onChangeText}
          onSubmitEditing={addTodo}
          value={text}
          placeholder={
            working ? "What do you want to do?" : "What do you want to study?"
          }
          style={styles.input}
        />
      )}

      {/* Todo list */}
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <Text
                style={{
                  ...styles.todoText,
                  textDecorationLine: todos[key].completed
                    ? "line-through"
                    : "none",
                  color: todos[key].completed ? theme.light : "white",
                }}
              >
                {todos[key].text}
              </Text>
              {/* <TouchableOpacity onPress={() => editClick(key)}>
                <AntDesign name="edit" size={20} color={theme.light} />
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => completeTodo(key)}>
                {todos[key].completed ? (
                  <Fontisto name="checkbox-active" size={16} color="white" />
                ) : (
                  <Fontisto
                    name="checkbox-passive"
                    size={16}
                    color={theme.light}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={18} color={theme.light} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => clearAll()} style={styles.clearAll}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  input: {
    backgroundColor: "white",
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 20,
    borderRadius: 10,
  },
  todo: {
    backgroundColor: theme.fade,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    width: "80%",
  },
  footer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 50,
  },
  clearAll: {
    backgroundColor: "tomato",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
  },
});
