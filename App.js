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
  const completeTodo = (key) => {
    const newTodos = { ...todos };
    newTodos[key] = { ...newTodos[key], completed: !newTodos[key].completed };
    setTodos(newTodos);
    saveTodos(newTodos);
    console.log(newTodos[key]);
  };

  const editClick = (key) => {
    const newTodos = { ...todos };
    console.log("New", newTodos);
    setCurrentTodo(newTodos[key]);
    setEditing(true);
    console.log("Edit: ", newTodos[key]);
  };
  const editTodo = (event) => {
    setCurrentTodo({ ...currentTodo, text: event.target.value });
    const newTodos = {
      ...todos,
      currentTodo,
    };
    setTodos(newTodos);
    saveTodos(newTodos);
    setEditing(false);
  };

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
  console.log("from Here");
  console.log(todos);
  return (
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

      {/* text input */}
      {editing ? (
        <TextInput
          onSubmitEditing={editTodo}
          value={currentTodo.text}
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
              <TouchableOpacity onPress={() => editClick(key)}>
                <AntDesign name="edit" size={20} color={theme.light} />
              </TouchableOpacity>

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
    width: "70%",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
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
