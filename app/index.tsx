import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Platform, Alert, Linking } from "react-native";
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
  const [ports, setPorts] = useState([80, 5500, 3300, 5050, 3030, 8080, 8081, 8082]);

  const fetchWithTimeout = (url: string, timeout: number = 2000) => Promise.race([
    fetch(url, { method: "GET" }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);

  const getConnectedDevices = async () => {
    setIsScanning(true);
    setHosts([]);

    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        console.log('Not connected to a network');
        return;
      }
      const baseIP = (await Network.getIpAddressAsync()).split('.').slice(0, 3).join('.');
      const ips2Check = Array.from({ length: 255 }, (_, i) => `${baseIP}.${i}`);
      const scanned: HostData[] = [];

      const packetsCount = 60 / (ports.length + 1);

      for (let i = 0; i < ips2Check.length; i += packetsCount) {
        setLoadingPercent(Math.floor((i / 255) * 100));
        setHosts(scanned);
        await new Promise(resolve => setTimeout(resolve, 10));

        const ipsBatch = ips2Check.slice(i, i + packetsCount);
        scanned.push(...(await Promise.all(
          ipsBatch.map(addr =>
            Promise.all(ports.map(port =>
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

      setHosts(scanned);
    } catch (error) {
      console.error("Error scanning network:", error);
    } finally {
      setLoadingPercent(0);
      setIsScanning(false);
    }
  }

  return (
    <View style={styles.body}>
      <View style={{ paddingHorizontal: 18 }}>
        <TouchableOpacity style={styles.button}
          onPress={!isScanning ? getConnectedDevices : () => { }}
          disabled={isScanning}>
          <Text style={styles.buttonText}>{isScanning ? `Loading... - ${loadingPercent}%` : "Load Local Sites"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList style={cardsStyle.list} data={hosts} renderItem={({ item }) =>
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