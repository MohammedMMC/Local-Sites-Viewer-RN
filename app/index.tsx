import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";

export default function Index() {
  const [hosts, setHosts] = useState([
    new HostData("192.168.1.1"),
    new HostData("192.168.1.1"),
    new HostData("192.168.1.1")
  ]);

  return (
    <View style={styles.body}>
      <View style={{ paddingHorizontal: 18 }}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Load Local Sites</Text>
        </TouchableOpacity>
      </View>

      <FlatList style={cardsStyle.list} data={hosts} renderItem={({ item }) =>
        <View style={cardsStyle.card}>
          <Text style={cardsStyle.title}>{item.title ?? "No Title"}</Text>
          <Text style={cardsStyle.text}>{item.ip}</Text>
          <View style={{
            flex: 1,
            flexDirection: "row",
            gap: "3%"
          }}>
            <TouchableOpacity style={cardsStyle.button}>
              <Text style={cardsStyle.buttonText}>External</Text>
            </TouchableOpacity>
            <TouchableOpacity style={cardsStyle.button}>
              <Text style={cardsStyle.buttonText}>Internal</Text>
            </TouchableOpacity>
          </View>
        </View>
      } />
    </View>
  );
}


const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingTop: 15,
    gap: 8
  },
  button: {
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: 500,
    letterSpacing: 0.5,
    fontSize: 18,
    textAlign: "center"
  }
});

const cardsStyle = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 18,
    width: "100%",
    marginTop: 10
  },
  card: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    borderColor: Colors.primary,
    borderWidth: 3,
    borderStyle: "solid",
    padding: 10,
    marginBottom: 15
  },
  title: {
    color: Colors.primaryDarker,
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

class HostData {
  ip: string;
  title: String | undefined;
  constructor(ip: string, title?: String) {
    this.ip = ip;
    this.title = title;
  }
}