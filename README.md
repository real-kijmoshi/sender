# 📁 Sender

This is a simple Node.js program that allows you to send files from one computer to another.

## 🚀 Getting Started

To use this program, you need to have Node.js installed on both the sending and receiving computers. You can download Node.js from the official website: https://nodejs.org/

Once you have Node.js installed, you can download or clone this repository to your local machine.

## 📝 Usage

### 🖥️ Server

First you need to run server by

```bash
npx ts-node server
```

default settings:

```json
"output": "output",
"port": 9090,
```

if you want to change them edit server/settings.json

### 🖥️ Client

tu run client you have to be in dir you want to send or its parent and run command

### running

```bash
npx ts-node [path to client dir] -p <path to dir you want to send>
```

example:

```bash
npx ts-node ../sender/client -p dir1/example folder
```

```json
"ignore": ["node_modules", "tests", ...files/folders you want]
```

### auth

you can write address and key that server shows or add auth_config.json that server generates to client folder

you can ignore files by adding


now you just need to accept connection on server and send transfer

#
<blockquote class="imgur-embed-pub" lang="en" data-id="a/XCqRKC9" data-context="false" ><a href="//imgur.com/a/XCqRKC9">sender example</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

#
## 📜 License

This program is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

If you have any questions or suggestions, please feel free to contact me at hello@kijmoshi.xyz.

Thank you for using this program!
