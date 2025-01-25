import { Colors } from "@/constants/Colors";
import { Styles } from '@/constants/Styles'
import { addBookmark, getBookmarks, openAppBrowser } from "@/constants/Functions";
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

export default function BookmarksScreen() {
  const [addModal, setAddModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [addBookmarkData, setAddBookmarkData] = useState(new BookmarkData({ ip: "", name: "", port: "" }));

  function addBookmarkUpdateInput(value: string, argName: string) {
    setAddBookmarkData({ ...addBookmarkData, [argName]: value });
  }

  useEffect(() => {
    (async function () {
      setBookmarks(await getBookmarks());
    })();
  }, []);

  useEffect(() => {
    if (!addModal) setAddBookmarkData(new BookmarkData({ ip: "", name: "", port: "" }));
  }, [addModal]);

  return (
    <View style={Styles.body}>
      <TouchableOpacity style={Styles.button}
        onPress={() => { setAddModal(true) }}>
        <MaterialIcons color={Styles.buttonText.color} size={25} name={"bookmark-add"} />
        <Text style={{ ...Styles.buttonText, textAlign: "auto" }}>Add Site</Text>
      </TouchableOpacity>

      {(bookmarks.length <= 0) && (<Text style={cardsStyle.text}>No Sites Found!</Text>)}
      <FlatList style={cardsStyle.list}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={bookmarks} renderItem={({ item }) =>
          <View style={cardsStyle.card}>
            <TouchableOpacity onPress={() => {
              AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarks.filter(i => i !== item)));
              setBookmarks(bookmarks.filter(i => i !== item));
              ToastAndroid.show("Bookmark removed successfully!", ToastAndroid.SHORT);
            }} style={cardsStyle.deleteButton}>
              <MaterialIcons color={Colors.redLight} size={35} name={"delete"} />
            </TouchableOpacity>

            <Text style={cardsStyle.title}>{item.name || "No Title"}</Text>
            <Text style={cardsStyle.text}>{item.ip}:{item.port}</Text>
            <View style={{
              flex: 1,
              flexDirection: "row",
              gap: "3%"
            }}>
              <TouchableOpacity onPress={() => openAppBrowser("http://" + item.ip, false)} style={cardsStyle.button}>
                <Text style={cardsStyle.buttonText}>External</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openAppBrowser("http://" + item.ip, true)} style={cardsStyle.button}>
                <Text style={cardsStyle.buttonText}>Internal</Text>
              </TouchableOpacity>
            </View>
          </View>
        } />

      <Modal animationType="fade" transparent={true}
        visible={addModal} onRequestClose={() => { setAddModal(false) }}>
        <TouchableWithoutFeedback onPress={() => { setAddModal(false) }}>
          <View style={modalsStyle.overlay}>
            <TouchableWithoutFeedback>
              <View style={modalsStyle.content}>
                <Text style={modalsStyle.title}>Add Site</Text>
                <View style={modalsStyle.inputContainer}>
                  <Text style={modalsStyle.text}>Name:</Text>
                  <TextInput style={modalsStyle.input} onChangeText={(v) => addBookmarkUpdateInput(v, "name")} placeholder="Your site name here" />
                </View>
                <View style={modalsStyle.inputContainer}>
                  <Text style={modalsStyle.text}>Ip:</Text>
                  <TextInput style={modalsStyle.input} onChangeText={(v) => addBookmarkUpdateInput(v, "ip")} placeholder="E.g. 192.168.1.1" />
                </View>
                <View style={modalsStyle.inputContainer}>
                  <Text style={modalsStyle.text}>Port:</Text>
                  <TextInput style={modalsStyle.input} onChangeText={(v) => addBookmarkUpdateInput(v, "port")} placeholder="E.g. 3030" />
                </View>
                <View style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  gap: 10
                }}>
                  <TouchableOpacity onPress={() => { setAddModal(false) }} style={{ ...modalsStyle.button, backgroundColor: Colors.red }}>
                    <Text style={modalsStyle.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    addBookmark(addBookmarkData);
                    setBookmarks([...bookmarks, addBookmarkData]);
                    setAddModal(false);
                    ToastAndroid.show("Bookmark added successfully!", ToastAndroid.SHORT);
                  }} style={modalsStyle.button}>
                    <Text style={modalsStyle.buttonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const cardsStyle = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%"
  },
  card: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    borderColor: Colors.primary,
    borderWidth: 3,
    borderStyle: "solid",
    padding: 10,
    marginBottom: 15
  },
  deleteButton: {
    position: "absolute",
    right: 2,
    top: 3,
    opacity: 0.8
  },
  title: {
    color: Colors.primary,
    fontWeight: 600,
    letterSpacing: 1,
    fontSize: 22
  },
  text: {
    color: Colors.text,
    fontWeight: 500,
    letterSpacing: 0.5,
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    width: "48.5%",
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: 500,
    fontSize: 16,
    textAlign: "center"
  }
});

const modalsStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    width: "90%",
    maxWidth: 500,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 8
  },
  title: {
    color: Colors.primary,
    fontWeight: 600,
    letterSpacing: 1,
    fontSize: 22
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10
  },
  text: {
    color: Colors.text,
    fontWeight: 500,
    letterSpacing: 0.5,
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    color: Colors.text,
    fontWeight: 500,
    letterSpacing: 0.5,
    fontSize: 18,
    marginBottom: 10,
    flex: 1,
    textAlign: "center",
    borderBottomColor: "#7a7a7a55",
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: 500,
    fontSize: 16,
    textAlign: "center"
  }
});

export class BookmarkData {
  ip: string;
  name: string;
  port: string;
  constructor({ ip, name, port }: { ip: string, name: string, port: string }) {
    this.ip = ip;
    this.name = name;
    this.port = port;
  }
}