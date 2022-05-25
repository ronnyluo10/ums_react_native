### ums_react_native
1.	Install expo dengan command npm install -g expo-cli
2.	Create folder baru, lalu jalankan perintah expo init UMSReactNative
3.	Masuk ke folder UMSReactNative
4.	Jalankan perintah berikut:
-	npm i @react-native-async-storage/async-storage
-	npm i @react-native-picker/picker
-	npm i @react-navigation/bottom-tabs
-	npm i @react-navigation/native
-	npm i @react-navigation/native-stack 
-	npm i react-native-dotenv
5.	Edit babel.config.js yang ada di root project kemudian di bawah presets: [‘babel-preset-expo’], tambah script di bawah ini:
"plugins": [
	["module:react-native-dotenv", {
	      "moduleName": "@env",
	      "path": ".env",
	      "blacklist": null,
	      "whitelist": null,
	      "safe": false,
	      "allowUndefined": true
}]
]
6.	Copy folder components dan Library yang di download sebelumnya dan paste di dalam folder UMSReactNative yang di create sebelumnya melalui expo
7.	Jalankan perintah npm start
8.	Download aplikasi expo di apps store maupun playstore
9.	Setelah itu scan barcode yang ada di terminal

Note: Masukkan semua file env yang ada di email ke dalam masing-masing folder root project dan di rename menjadi .env

*Selamat mencoba, jika ada kendala bisa hubungi saya*
