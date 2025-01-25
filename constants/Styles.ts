// App Main Styles
import { Colors } from "@/constants/Colors";
import { StyleProp } from "react-native";

export const Styles: Record<string, StyleProp<any>> = {
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
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        gap: 5
    },
    buttonText: {
        color: Colors.background,
        fontWeight: 500,
        letterSpacing: 0.5,
        fontSize: 18,
        textAlign: "center"
    }
}