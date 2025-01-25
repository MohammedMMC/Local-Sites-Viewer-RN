import { Colors } from "@/constants/Colors";
import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarLabelStyle: { color: Colors.background, fontWeight: '600' },
                tabBarStyle: { backgroundColor: Colors.primary, height: 60 },
                tabBarIconStyle: { color: Colors.background, marginVertical: 3 },
                tabBarInactiveTintColor: Colors.primaryLight,
                tabBarActiveTintColor: Colors.background,
                // tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <MaterialIcons color={color} size={32} name={"home"} />,
                }}
            />
            <Tabs.Screen
                name="bookmarks"
                options={{
                    title: "Bookmarks",
                    tabBarIcon: ({ color }) => <MaterialIcons color={color} size={32} name={"bookmark"} />,
                }}
            />
            <Tabs.Screen
                name="ports"
                options={{
                    title: "Ports",
                    tabBarIcon: ({ color }) => <MaterialIcons color={color} size={32} name={"door-sliding"} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <MaterialIcons color={color} size={32} name={"settings"} />,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: "About",
                    tabBarIcon: ({ color }) => <MaterialIcons color={color} size={32} name={"info"} />,
                }}
            />
        </Tabs>
    );
}
