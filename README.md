<div align="center">

# 📺 MyTV - Modern IPTV Streaming App

### A sleek, feature-rich IPTV streaming application built with React

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![HLS.js](https://img.shields.io/badge/HLS.js-1.6-FF6B6B?style=for-the-badge)](https://github.com/video-dev/hls.js/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>🌍 10,000+ Channels</strong> • 
  <strong>🎨 Dark/Light Theme</strong> • 
  <strong>🔍 Smart Search</strong> • 
  <strong>🛡️ CORS Proxy</strong>
</p>

---

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📖 Usage](#-usage) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Project Structure](#-project-structure)

</div>

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="33%">
      <img width="60" src="https://cdn-icons-png.flaticon.com/512/2991/2991195.png" alt="Live TV"/>
      <br/><strong>📡 Live Streaming</strong>
      <br/><sub>Watch 10,000+ channels from around the world in real-time</sub>
    </td>
    <td align="center" width="33%">
      <img width="60" src="https://cdn-icons-png.flaticon.com/512/6974/6974276.png" alt="Categories"/>
      <br/><strong>📂 Smart Categories</strong>
      <br/><sub>Filter by News, Sports, Movies, Music, Kids, and more</sub>
    </td>
    <td align="center" width="33%">
      <img width="60" src="https://cdn-icons-png.flaticon.com/512/2099/2099063.png" alt="Search"/>
      <br/><strong>🔍 Instant Search</strong>
      <br/><sub>Find channels instantly by name or country</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="60" src="https://cdn-icons-png.flaticon.com/512/7897/7897259.png" alt="Theme"/>
      <br/><strong>🌓 Theme Toggle</strong>
      <br/><sub>Beautiful dark & light modes with smooth transitions</sub>
    </td>
    <td align="center">
      <img width="60" src="https://cdn-icons-png.flaticon.com/512/1452/1452378.png" alt="Flags"/>
      <br/><strong>🏳️ Country Flags</strong>
      <br/><sub>Visual country identification for every channel</sub>
    </td>
    <td align="center">
      <img width="60" src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png" alt="Proxy"/>
      <br/><strong>🛡️ CORS Proxy</strong>
      <br/><sub>Built-in proxy server to bypass stream restrictions</sub>
    </td>
  </tr>
</table>

---

## 🎯 Demo Preview

<table>
  <tr>
    <td align="center">
      <strong>🌙 Dark Mode</strong>
      <br/>
      <img src="public\images\Screenshot 2025-12-23 165817.png" alt="Dark Mode" width="400"/>
    </td>
    <td align="center">
      <strong>☀️ Light Mode</strong>
      <br/>
      <img src="public\images\Screenshot 2025-12-23 165747.png" alt="Light Mode" width="400"/>
    </td>
    <td align="center">
      <strong>Stream</strong>
      <br/>
      <img src="public\images\Screenshot 2025-12-23 170151.png" alt="Stream" width="400"/>
    </td>
  </tr>
</table>


---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mytv.git

# Navigate to project directory
cd mytv

# Install dependencies
npm install

# Start the development server
npm run dev
```

🎉 **Open [http://localhost:5173](http://localhost:5173) in your browser!**

---

## 📖 Usage

### Basic Usage

1. **Browse Channels** - Scroll through the channel grid or use categories
2. **Search** - Type in the search bar to find specific channels
3. **Play** - Click any channel card to start streaming
4. **Theme** - Toggle dark/light mode with the sun/moon icon

### CORS Proxy (For Blocked Streams)

Some streams may be blocked by CORS. Enable the proxy server:

```bash
# In a separate terminal
npm run proxy
```

Then click the **🛡️ Shield Icon** in the video player to enable proxy mode.

<details>
<summary>📌 <strong>Available NPM Scripts</strong></summary>

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run proxy` | Start CORS proxy server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

</details>

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|:----------:|:--------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build Tool |
| ![HLS.js](https://img.shields.io/badge/HLS.js-FF6B6B?style=flat-square) | Video Streaming |
| ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square) | Data Fetching |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | Proxy Server |
| ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square) | Icons |

</div>

---

## 📁 Project Structure

```
mytv/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📄 ChannelCard.jsx    # Channel display card
│   │   └── 📄 VideoPlayer.jsx    # HLS video player
│   ├── 📄 App.jsx                # Main application
│   ├── 📄 main.jsx               # Entry point
│   └── 📄 index.css              # Global styles
├── 📄 proxy-server.js            # CORS proxy server
├── 📄 vite.config.js             # Vite configuration
└── 📄 package.json               # Dependencies
```

---

## 🌐 API Integration

This app uses the [IPTV-org API](https://github.com/iptv-org/api) - a community-maintained database of publicly available IPTV channels.

| Endpoint | Data |
|----------|------|
| `/channels.json` | Channel metadata |
| `/streams.json` | Stream URLs |
| `/logos.json` | Channel logos |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 Create a **feature branch** (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a **Pull Request**

---

## ⚠️ Disclaimer

This application is for **educational purposes only**. It aggregates publicly available IPTV streams from the IPTV-org community project. The developer does not host, provide, or have control over any streams. Users are responsible for ensuring they have the legal right to access any content.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">



⭐ **Star this repo if you found it useful!** ⭐

</div>
