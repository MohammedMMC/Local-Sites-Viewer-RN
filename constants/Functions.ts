
import { Config } from '@/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { Colors } from "@/constants/Colors";
import { Alert, Linking, ToastAndroid } from 'react-native';
import { BookmarkData } from '@/app/(tabs)/bookmarks';

export const openAppBrowser = async (url: string, isInternal: boolean = false) => {
    try {
        if (!isInternal) {
            await Linking.openURL(url);
        } else {
            await WebBrowser.openBrowserAsync(url, {
                showTitle: true,
                toolbarColor: Colors.primary,
                secondaryToolbarColor: Colors.primary,
                controlsColor: Colors.background
            });
        }
    } catch (error) {
        Alert.alert("Error", "Connot open the URL!")
    }
}

export const savePorts = async (ports: string[]) => {
    try {
        await AsyncStorage.setItem("ports", JSON.stringify(ports));
    } catch (e) {
        ToastAndroid.show("Connot save the ports!", ToastAndroid.SHORT);
    }
}
export const loadPorts = async (): Promise<string[]> => {
    try {
        const ports = await AsyncStorage.getItem("ports");
        return ports ? JSON.parse(ports) : [...Config.defaultPorts];
    } catch (e) {
        return [...Config.defaultPorts];
    }
}
export const removePort = async (port: string) => {
    try {
        const ports = await loadPorts();
        await savePorts(ports.filter(p => p !== port));
    } catch (e) {
        ToastAndroid.show("Connot remove the port!", ToastAndroid.SHORT);
    }
}

export const getOrSetData = async (key: string, data?: string) => {
    try {
        if (data === undefined) {
            return await AsyncStorage.getItem(key);
        }
        await AsyncStorage.setItem(key, data);
    } catch (e) {
        ToastAndroid.show("Error while accessing the storage!", ToastAndroid.SHORT);
    }
}

export const getBookmarks = async (): Promise<BookmarkData[]> => {
    try {
        const bookmarks = await getOrSetData("bookmarks");
        return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (e) {
        return [];
    }
}

export const addBookmark = async (bookmark: BookmarkData) => {
    try {
        const bookmarks = await getBookmarks();
        await AsyncStorage.setItem("bookmarks", JSON.stringify([...bookmarks, bookmark]));
    } catch (e) {
        ToastAndroid.show("Connot add the bookmark!", ToastAndroid.SHORT);
    }
}