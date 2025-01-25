# Local Sites Viewer App (Using React Native)

It is a simple tool for web developers to quickly test their local websites on
other devices, like phones or tablets, connected to the same network.

Instead of typing your IP and port every time, this app does it for you. It detects your local IP,
scans active ports, and shows you a list of working local sites.

#### Preview

![Preview Image](https://github.com/MohammedMMC/Local-Sites-Viewer-RN/blob/main/preview.png?raw=true)

## How It Works

1. Add or remove ports to customize the search.
2. Press **Load Local Sites**.
3. The app checks for working local sites.
4. Sites with a `200 OK` response are displayed.

## Example Output

If your local IP is `192.168.1.10` and ports `3000, 8000, 8080` are scanned:
_(it scans for all the IPs that same as your local ip: 192.168.1.\*)_

```
Local Sites Found:
1. http://192.168.1.1:80
2. http://192.168.1.9:3000
3. http://192.168.1.23:8080
```

## Pages

### Home
- Main screen for scanning local network
- Shows list of discovered local sites
- Options to open sites externally or in-app

### Bookmarks
- Add custom sites with name, IP, and port
- Quick access to saved sites

### Ports
- Manage ports to scan
- Add single or multiple ports
- Default port: 80

### Settings
- Adjust search speed
- Configure IP range for scanning
- Toggle automatic loading at startup

### About
- App information and description
- How the app works
- License information

## Contributions

Feel free to contribute! Submit issues, suggestions, or pull requests to improve the app.

## License

This project is licensed under the MIT License.
