import { Colors } from "@/constants/Colors";
import { loadPorts, savePorts } from "@/constants/Functions";
import { Styles } from "@/constants/Styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

export default function PortsScreen() {
  const [ports, setPorts] = useState<string[]>(["80"]);
  const [port2ra, setPort2ra] = useState<null | number | string>(null);
  const [modals, setModals] = useState({ removePort: false, addPort: false });

  const hideAllModals = () => {
    setPort2ra(null);
    setModals({ ...modals, removePort: false, addPort: false });
  }

  useEffect(() => {
    const loadSavedPorts = async () => {
      const savedPorts = await loadPorts();
      setPorts(savedPorts);
    };
    loadSavedPorts();
  }, []);
  useEffect(() => {
    savePorts(ports);
  }, [ports]);

  return (
    <View style={Styles.body}>
      <TouchableOpacity style={Styles.button}
        onPress={() => setModals({ ...modals, removePort: false, addPort: true })}>
        <MaterialIcons color={Styles.buttonText.color} size={25} name={"add"} />
        <Text style={{ ...Styles.buttonText, textAlign: "auto" }}>Add Port</Text>
      </TouchableOpacity>

      {(ports.length <= 0) && (<Text style={modalsStyle.text}>No ports Found!</Text>)}
      <View style={portsStyle.listContainer}>
        <FlatList contentContainerStyle={portsStyle.list} style={portsStyle.list}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={ports} renderItem={({ item }) =>
            <View style={portsStyle.card}>
              <Text style={portsStyle.text}>{item}</Text>
              <TouchableOpacity onPress={() => { setModals({ ...modals, removePort: true, addPort: false }); setPort2ra(item) }}>
                <MaterialIcons color={Colors.redLight} size={35} name={"delete"} />
              </TouchableOpacity>
            </View>
          } />
      </View>

      <Modal animationType="fade" transparent={true}
        visible={modals.removePort || modals.addPort} onRequestClose={hideAllModals}>
        <TouchableWithoutFeedback onPress={hideAllModals}>
          <View style={modalsStyle.overlay}>
            <TouchableWithoutFeedback>
              <View style={modalsStyle.content}>
                <Text style={modalsStyle.title}>{modals.removePort ? "Remove Port" : "Add Port"}</Text>
                <Text style={modalsStyle.text}>{modals.removePort ? "Do you want to remove the port?" : "Enter port(s) number to add:"}</Text>
                {modals.addPort && (<TextInput style={modalsStyle.input} onChangeText={setPort2ra} placeholder="Enter a port, E.g. 3030, 3000" />)}
                <View style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  gap: 10
                }}>
                  <TouchableOpacity onPress={hideAllModals} style={{ ...modalsStyle.button, backgroundColor: Colors.red }}>
                    <Text style={modalsStyle.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    if (modals.removePort) {
                      setPorts(ports.filter(p => p !== port2ra));
                      hideAllModals();
                      ToastAndroid.show("Port removed successfully!", ToastAndroid.SHORT);
                    } else {
                      if (port2ra && typeof port2ra === "string") setPorts([...ports, ...port2ra.replaceAll(" ", "").split(",")]);
                      hideAllModals();
                      ToastAndroid.show("Port added successfully!", ToastAndroid.SHORT)
                    }
                  }} style={modalsStyle.button}>
                    <Text style={modalsStyle.buttonText}>{modals.removePort ? "Remove" : "Add"}</Text>
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

const portsStyle = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
  },
  list: {
    flexDirection: "column",
    gap: 15
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderColor: Colors.primary,
    borderWidth: 3,
    borderStyle: "solid",
    padding: 10,
  },
  text: {
    color: Colors.primary,
    fontWeight: 600,
    letterSpacing: 1,
    fontSize: 30
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
    width: "100%",
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
