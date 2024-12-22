import { Colors } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Platform, Alert, Linking, Modal, TouchableWithoutFeedback, ToastAndroid, TextInput } from "react-native";
import * as Network from 'expo-network';
import * as WebBrowser from 'expo-web-browser';

const openAppBrowser = async (url: string, isInternal: boolean) => {
  try {
    if (!isInternal) {
      await Linking.openURL(url);
    } else {
      await WebBrowser.openBrowserAsync(url, {
        showTitle: true,
        toolbarColor: Colors.primary,
        secondaryToolbarColor: Colors.primaryDarker
      });
    }
  } catch (error) {
    Alert.alert("Error", "Connot open the URL!")
  }
}

export default function Index() {
  const [hosts, setHosts] = useState<HostData[]>([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const stopScanning = useRef(false);
  const [modals, setModals] = useState({ removePort: false, addPort: false });
  const [ports, setPorts] = useState<(number | string)[]>(["+ Add", 80, 5500, 5501, 5050]);
  const [port2ra, setPort2ra] = useState<null | number | string>(null);

  const hideAllModals = () => {
    setPort2ra(null);
    setModals({ ...modals, removePort: false, addPort: false });
  }

  const fetchWithTimeout = (url: string, timeout: number = 2000) => Promise.race([
    fetch(url, { method: "GET" }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);

  const getConnectedDevices = async () => {
    setIsScanning(true);
    setHosts([]);
    stopScanning.current = false;

    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        console.log('Not connected to a network');
        return;
      }
      const baseIP = (await Network.getIpAddressAsync()).split('.').slice(0, 3).join('.');
      const ips2Check = Array.from({ length: 255 }, (_, i) => `${baseIP}.${i}`);
      let scanned: HostData[] = [];

      const packetsCount = 60 / (ports.length - 1);

      for (let i = 0; i < ips2Check.length; i += packetsCount) {
        if (stopScanning.current) break;


        setLoadingPercent(Math.floor((i / 255) * 100));
        setHosts(scanned);
        await new Promise(resolve => setTimeout(resolve, 10));

        const ipsBatch = ips2Check.slice(i, i + packetsCount);
        scanned.push(...(await Promise.all(
          ipsBatch.map(addr =>
            Promise.all(ports.map(port => port === "+ Add" ? null :
              fetchWithTimeout(`http://${addr}:${port}`)
                .then(async (res: Response | any) =>
                  new HostData(`${addr}:${port}`,
                    (await res.text()).match(/<title>(.*?)<\/title>/i)?.[1] ?? null
                  )
                ).catch(() => null)
            ))
          )
        )).flat().filter(ip => ip instanceof HostData));
      }

      if (stopScanning.current) scanned = [];
      setHosts(scanned);
    } catch (error) {
      console.error("Error scanning network:", error);
    } finally {
      setLoadingPercent(0);
      stopScanning.current = false;
      setIsScanning(false);
    }
  }

  return (
    <View style={styles.body}>
      <View>
        <TouchableOpacity style={styles.button}
          onPress={!isScanning ? getConnectedDevices : () => stopScanning.current = true}>
          <Text style={styles.buttonText}>{isScanning ? `Loading... - ${loadingPercent}%` : "Load Local Sites"}</Text>
        </TouchableOpacity>
      </View>

      <View style={portsStyle.listContainer}>
        <FlatList contentContainerStyle={portsStyle.list} style={portsStyle.list}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={ports} renderItem={({ item }) =>
            <TouchableOpacity onPress={() => { setModals({ ...modals, removePort: item !== "+ Add", addPort: item === "+ Add" }); setPort2ra(item === "+ Add" ? null : item) }} style={portsStyle.card}>
              <Text style={portsStyle.text}>{item}</Text>
            </TouchableOpacity>
          } />
      </View>

      {(!isScanning && hosts.length <= 0) && (<Text style={cardsStyle.text}>No Sites Found!</Text>)}
      <FlatList style={cardsStyle.list}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={hosts} renderItem={({ item }) =>
          <View style={cardsStyle.card}>
            <Text style={cardsStyle.title}>{item.title || "No Title"}</Text>
            <Text style={cardsStyle.text}>{item.ip}</Text>
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
  );
}


const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 18,
    paddingTop: 15,
    gap: 12
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
    width: "100%"
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

const portsStyle = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
  },
  list: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 15
  },
  card: {
    alignItems: "center",
    borderRadius: 12,
    borderColor: Colors.primary,
    borderWidth: 3,
    borderStyle: "solid",
    padding: 10,
  },
  text: {
    color: Colors.primaryDarker,
    fontWeight: 600,
    letterSpacing: 1,
    fontSize: 20
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


class HostData {
  ip: string;
  title: String | undefined;
  constructor(ip: string, title?: String) {
    this.ip = ip;
    this.title = title;
  }
}