import { Styles } from '@/constants/Styles'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default function AboutScreen() {
  return (
    <View style={{ ...Styles.body, alignItems: "flex-start" }}>
      <Text style={styles.title}>Local Sites Viewer</Text>
      <Text style={styles.subtitle}>A React Native App</Text>

      <View style={styles.section}>
        <Text style={styles.text}>
          A simple tool for web developers to quickly test their local websites on
          other devices, like phones or tablets, connected to the same network.
        </Text>
        <Text style={styles.text}>
          Instead of typing your IP and port every time, this app does it for you. It detects your local IP,
          scans active ports, and shows you a list of working local sites.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pages</Text>
        <Text style={styles.sectionSubtitle}>- Home</Text>
        <Text style={styles.listItem}>• Main screen for scanning local network</Text>
        <Text style={styles.listItem}>• Shows list of discovered local sites</Text>
        <Text style={styles.listItem}>• Options to open sites externally or in-app</Text>

        <Text style={styles.sectionSubtitle}>- Bookmarks</Text>
        <Text style={styles.listItem}>• Add custom sites with name, IP, and port</Text>
        <Text style={styles.listItem}>• Quick access to saved sites</Text>

        <Text style={styles.sectionSubtitle}>- Ports</Text>
        <Text style={styles.listItem}>• Manage ports to scan</Text>
        <Text style={styles.listItem}>• Add single or multiple ports</Text>
        <Text style={styles.listItem}>• Default port: 80</Text>

        <Text style={styles.sectionSubtitle}>- Settings</Text>
        <Text style={styles.listItem}>• Adjust search speed</Text>
        <Text style={styles.listItem}>• Configure IP range for scanning</Text>
        <Text style={styles.listItem}>• Toggle automatic loading at startup</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Licensed under MIT License</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  footer: {
    width: "100%",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#444',
  },
})
