import React from 'react'
import { BackHandler } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from "@env"

const helpers = {
	async _api(uri, method, token, body) {
		let headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
		
		let params = {
			method: method,
		}

		if(token) headers['Authorization'] = 'Bearer '+token

		params['headers'] = headers
		
		if(body) params['body'] = JSON.stringify(body)

		try {
			const response = await fetch(API_URL+uri, params)
			if(response.ok || response.status == 422 || response.status == 401 || response.status == 400) return await response.json()
			throw new Error("Network response was not ok")
		}
		catch(error) {
			throw new Error(error.message)
		}
	},

	async saveDataUser(data) {
		try {
			await AsyncStorage.setItem('user', JSON.stringify(data));
		} catch (error) {
			throw new Error(error.message)
		}
	},

	async isLogin(navigation) {
		try {
			const value = await AsyncStorage.getItem('user')
			if(value !== null) {
				navigation.navigate('Layout')
			}
		} catch(error) {
			throw new Error(error.message)
		}
	},

	async getDataUser() {
		try {
			let result = await AsyncStorage.getItem('user')
			return  await JSON.parse(result)
		} catch(error) {
			throw new Error(error.message)
		}
	},

	async deleteDataUser(key) {
		try {
			return await AsyncStorage.removeItem(key)
		} catch(error) {
			throw new Error(error.message)
		}
	},

	comma(Num) {
	    var value = Num

	    value += '';
	    value = value.replace('.', ''); value = value.replace('.', ''); value = value.replace('.', '');
	    value = value.replace('.', ''); value = value.replace('.', ''); value = value.replace('.', '');
	    
	    var x = value.split(',');
	    var x1 = x[0];
	    var x2 = x.length > 1 ? ',' + x[1] : '';
	    
	    var rgx = /(\d+)(\d{3})/;
	    
	    while (rgx.test(x1))
	    
	    x1 = x1.replace(rgx, '$1' + '.' + '$2');
	    
	    return x1 + x2;
	}
}

export default helpers