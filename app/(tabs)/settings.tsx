import { Colors } from "@/constants/Colors";
import { Config } from '@/constants/Config';
import { Styles } from '@/constants/Styles'
import { getOrSetData, openAppBrowser } from '@/constants/Functions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import Slider from '@react-native-community/slider';


export default function SettingsScreen() {
  const [autoLoadatSU, setAutoLoadatSU] = useState(Config.defaultAutoLoadatSU);
  const [loadingSpeed, setLoadingSpeed] = useState(Config.defaultLoadingSpeed);
  const [endRange, setEndRange] = useState(Config.defaultEndRange);

  useEffect(() => {
    // (async () => {
    getOrSetData("autoloadatsu").then(d => setAutoLoadatSU(d ? (d === "false" ? false : true) : Config.defaultAutoLoadatSU));
    getOrSetData("loadingspeed").then(d => setLoadingSpeed(d ? Number(d) : Config.defaultLoadingSpeed));
    getOrSetData("endrange").then(d => setEndRange(d ? Number(d) : Config.defaultEndRange));
    // })();
  }, []);

  useEffect(() => {
    getOrSetData("autoloadatsu", String(autoLoadatSU));
    getOrSetData("loadingspeed", String(loadingSpeed));
    getOrSetData("endrange", String(endRange));
  }, [autoLoadatSU, loadingSpeed, endRange]);

  return (
    <View style={Styles.body}>
      <View style={{ marginVertical: 5, width: "100%" }}>
        <View style={settingsStyles.optionsTitleContainer}>
          <Text style={settingsStyles.optionsTitle}>Search Speed: </Text>
          <Text style={settingsStyles.optionsSmallTitleInfo}>(Faster speeds may affect result accuracy)</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={settingsStyles.sliderLabel}>Normal</Text>
          <Text style={settingsStyles.sliderLabel}>Fast</Text>
          <Text style={settingsStyles.sliderLabel}>Faster</Text>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={2}
          value={loadingSpeed}
          step={1}
          onValueChange={(v) => setLoadingSpeed(v)}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.primary}
          thumbTintColor={Colors.background}
        />
      </View>

      <View style={{ marginVertical: 5, width: "100%" }}>
        <View style={settingsStyles.optionsTitleContainer}>
          <Text style={settingsStyles.optionsTitle}>End Range: </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={settingsStyles.sliderLabel}>0</Text>
          <Text style={{ ...settingsStyles.sliderLabel, fontSize: settingsStyles.sliderLabel.fontSize + 10 }}>( {endRange} )</Text>
          <Text style={settingsStyles.sliderLabel}>255</Text>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={255}
          value={endRange}
          step={1}
          onValueChange={(v) => setEndRange(v)}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.primary}
          thumbTintColor={Colors.background}
        />
      </View>

      <View style={{ marginVertical: 5, width: "100%", flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={settingsStyles.optionsTitleContainer}>
          <Text style={settingsStyles.optionsTitle}>Load Automatically at Startup: </Text>
        </View>
        <Switch
          trackColor={{ true: Colors.primary }}
          thumbColor={Colors.background}
          onValueChange={() => setAutoLoadatSU(!autoLoadatSU)}
          value={autoLoadatSU}
        />
      </View>

      <View style={{ marginVertical: 5, width: "100%" }}>
        <TouchableOpacity style={Styles.button}
          onPress={() => openAppBrowser(Config.issuesURL)}>
          <MaterialIcons color={Styles.buttonText.color} size={25} name={"bug-report"} />
          <Text style={{ ...Styles.buttonText, textAlign: "auto" }}>Report Bug</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const settingsStyles = StyleSheet.create({
  optionsTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  optionsSmallTitleInfo: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.text
  },
  sliderLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    alignSelf: 'flex-end',
  },
});