import appJSON from "@/app.json";

export const Config = {
    appName: appJSON.expo.name,
    version: appJSON.expo.version,

    githubURL: "https://github.com/MohammedMMC/Local-Sites-Viewer-RN",
    issuesURL: "https://github.com/MohammedMMC/Local-Sites-Viewer-RN/issues",

    defaultPorts: ["80"],
    defaultEndRange: 255,
    defaultLoadingSpeed: 0,
    defaultAutoLoadatSU: true,

    fetchTimeoutDuration: 2000
};