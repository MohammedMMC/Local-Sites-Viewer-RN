import { Config } from "@/constants/Config";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { getOrSetData, loadPorts, openAppBrowser } from "@/constants/Functions";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import * as Network from 'expo-network';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


export default function HomeScreen() {
  const [hosts, setHosts] = useState<HostData[]>([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const stopScanning = useRef(false);

  const fetchWithTimeout = (url: string, timeout: number = Config.fetchTimeoutDuration) => Promise.race([
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

      const loadingspeed = await getOrSetData("loadingspeed").then(d => d ? Number(d) : Config.defaultLoadingSpeed);
      const endrange = (await getOrSetData("endrange").then(d => d ? Number(d) : Config.defaultEndRange)) + 1;

      const baseIP = (await Network.getIpAddressAsync()).split('.').slice(0, 3).join('.');
      const ips2Check = Array.from({ length: endrange }, (_, i) => `${baseIP}.${i}`);
      let scanned: HostData[] = [];

      const ports = await loadPorts();

      let packetsCount = (Math.round(endrange / 4.25) / (ports.length - 1 <= 0 ? 1 : ports.length - 1)) * (loadingspeed + 1);
      if (packetsCount > 255) packetsCount = 255;
      if (packetsCount <= 0) packetsCount = 1;

      for (let i = 0; i < ips2Check.length; i += packetsCount) {
        if (stopScanning.current || ports.length <= 0) break;

        setLoadingPercent(Math.floor((i / endrange) * 100));
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
      stopScanning.current = false;
      setIsScanning(false);
    }
  }

  useEffect(() => {
    getOrSetData("autoloadatsu").then(d => {
      const autoLoadatSU = (d ? (d === "false" ? false : true) : Config.defaultAutoLoadatSU);

      if (autoLoadatSU && !isScanning) {
        getConnectedDevices();
      }
    });
  }, []);

  return (
    <View style={Styles.body}>
      <TouchableOpacity style={Styles.button}
        onPress={!isScanning ? getConnectedDevices : () => stopScanning.current = true}>
        <MaterialIcons color={Styles.buttonText.color} size={25} name={"search"} />
        <Text style={Styles.buttonText}>{isScanning ? `Loading... - ${loadingPercent}%` : "Load Local Sites"}</Text>
      </TouchableOpacity>

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



    </View>
  );
}

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


class HostData {
  ip: string;
  title: string | undefined;
  constructor(ip: string, title?: string) {
    this.ip = ip;
    this.title = title;
  }
}