import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, ScrollView, Text, TextInput, Button, ActivityIndicator, BackHandler } from 'react-native'
import helpers from '../../Library/helpers.js'

const AkunScreen = ({ navigation }) => {
	const [user, setUser] = useState({
		nama: '',
		email: '',
	})
	const [token, setToken] = useState('')
	const [success, setSuccess] = useState(false)
	const [errors, setErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [counter, setCounter] = useState(0)
	const [userData, setUserData] = useState({})
	const [password, setPassword] = useState({
		kata_sandi_sekarang: '',
		kata_sandi_baru: '',
		konfirmasi_kata_sandi: '',
		_method: 'PUT'
	})

	useEffect(() => {
		setCounter(counter + 1)

		getData()

		setTimeout(() => {
			const willFocusSubscription = navigation.addListener('focus', () => {
				if(counter < 1) {
					getData()	
		    	}
		    })

		    return willFocusSubscription
		}, 1000)

	    setTimeout(() => {
			setCounter(0)
		}, 1200)

		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [])

	const backAction = () => {
		navigation.goBack()
		return true
	}

	const getData = () => {
		helpers.getDataUser().then(response => {
			setUserData(response.user)
			setUser({
				...user,
				nama: response.user.name,
				email: response.user.email
			})
			setToken(response.token)
		}).catch((error) => {
			showError(error)
		})
	}

	const showError = (error) => {
		setErrors({
			systemError: error.message
		})

		setTimeout(() => {
			setErrors({})
		}, 3000)
	}

	const onChangeTextValue = (value, name) => {
		setUser({
			...user,
			[name]: value
		})
	}

	const handleChangePasswordValue = (value, name) => {
		setPassword({
			...password,
			[name]: value
		})	
	}

	const successConfirm = () => {
		setSuccess(true)

		setTimeout(() => {
			setSuccess(false)
		}, 3000)
	}

	const clearError = () => {
		if(Object.keys(errors).length > 0) {
			setErrors({})
		}
	}

	const saveData = () => {
		setIsLoading(true)
		clearError()

		helpers._api('/akun/ubah/profil', 'PUT', token, user).then((json) => {
			setIsLoading(false)

			if(json.errors) setErrors(json.errors)
			else if(!json.success) showError(json)
			else {
				successConfirm()

				helpers.saveDataUser({
					'token': token,
					'user': {
						id: userData.id,
						name: user.nama,
						email: user.email,
					}
				})
			}
		}).catch((error) => {
			setIsLoading(false)
			showError(error)			
		})
	}

	const changePassword = () => {
		setIsLoading(true)
		clearError()
		
		helpers._api('/akun/ubah/kata-sandi', 'PUT', token, password).then((json) => {
			setIsLoading(false)
			
			if(json.errors) setErrors(json.errors)
			else if(!json.success) showError(json)
			else {
				successConfirm()

				setPassword(password => ({
					kata_sandi_sekarang: '',
					kata_sandi_baru: '',
					konfirmasi_kata_sandi: '',
				}))
			}
		}).catch((error) => {
			setIsLoading(false)
			showError(error)
		})
	}

	const generateToken = () => {
		setIsLoading(true)
		clearError()
		
		helpers._api('/akun/generate-new-token', 'POST', token).then((json) => {
			setIsLoading(false)
			
			if(json.errors) setErrors(json.errors)
			else if(!json.success) showError(json)
			else {
				const { results } = json

				successConfirm()
				
				setToken(token => results.token)
				helpers.saveDataUser(results)
			}
		}).catch((error) => {
			setIsLoading(false)
			showError(error)
		})
	}

	const logout = () => {
		setIsLoading(true)
		clearError()

		helpers._api('/logout', 'POST', token).then(() => {
			helpers.deleteDataUser('user')

			setTimeout(() => {
				setIsLoading(false)
				navigation.navigate('Welcome')	
			})
		}).catch((error) => {
			setIsLoading(false)
			showError(error)
		})
	}

	return (
		<SafeAreaView style={{ flex: 1, height: '100%' }}>
			<ScrollView>
				{ success && (
					<View style={{
						backgroundColor: '#dff0d8',
						padding: 15,
					}}>
						<Text style={{ color: '#3c763d' }}>Berhasil simpan data</Text>
					</View>
				) }

				{errors && errors.systemError && (
					<View style={{
						backgroundColor: '#f2dede',
						padding: 15,
					}}>
						<Text style={{ color: '#A94433' }}>{ errors.systemError }</Text>
					</View>
				)}

				<View style={{ paddingLeft: 15, paddingRight: 15, marginTop: 10 }}>
					<Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Informasi Profil</Text>
					
					<View style={{ backgroundColor: '#fff', padding: 15 }}>
						<Text style={{ fontWeight: 'bold' }}>Nama *</Text>
						<TextInput 
							style={{ height: 40, backgroundColor: '#999', color: '#fff', paddingLeft: 10 }}
							value={ user.nama }
							onChangeText={ (value) => onChangeTextValue(value, 'nama') }
						/>

						{ errors && errors.nama  ? 
							errors.nama.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}

						<Text style={{ fontWeight: 'bold', marginTop: 10 }}>Email *</Text>
						<TextInput 
							style={{ height: 40, backgroundColor: '#999', color: '#fff', paddingLeft: 10 }}
							value={ user.email }
							onChangeText={ (value) => onChangeTextValue(value, 'email') }
						/>

						{ errors && errors.email  ? 
							errors.email.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}

						<View style={{ marginTop: 10 }}>
							<Button 
								title="Simpan"
								onPress={ saveData }
							/>
						</View>
					</View>

					<Text style={{ fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>Perbaharui Kata Sandi</Text>
					
					<View style={{ backgroundColor: '#fff', padding: 15 }}>
						<Text style={{ fontWeight: 'bold' }}>Kata Sandi Sekarang *</Text>
						<TextInput 
							style={{ height: 40, backgroundColor: '#999', color: '#fff', paddingLeft: 10 }}
							secureTextEntry={ true }
							value={ password.kata_sandi_sekarang }
							onChangeText={ (value) => handleChangePasswordValue(value, 'kata_sandi_sekarang') }
							autoCapitalize='none'
						/>

						{ errors && errors.kata_sandi_sekarang  ? 
							errors.kata_sandi_sekarang.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}

						<Text style={{ fontWeight: 'bold', marginTop: 10 }}>Kata Sandi Baru *</Text>
						<TextInput 
							style={{ height: 40, backgroundColor: '#999', color: '#fff', paddingLeft: 10 }}
							secureTextEntry={ true }
							value={ password.kata_sandi_baru }
							onChangeText={ (value) => handleChangePasswordValue(value, 'kata_sandi_baru') }
							autoCapitalize='none'
						/>

						{ errors && errors.kata_sandi_baru  ? 
							errors.kata_sandi_baru.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}

						<Text style={{ fontWeight: 'bold', marginTop: 10 }}>Konfirmasi Kata Sandi *</Text>
						<TextInput 
							style={{ height: 40, backgroundColor: '#999', color: '#fff', paddingLeft: 10 }}
							secureTextEntry={ true }
							value={ password.konfirmasi_kata_sandi }
							onChangeText={ (value) => handleChangePasswordValue(value, 'konfirmasi_kata_sandi') }
							autoCapitalize='none'
						/>

						{ errors && errors.konfirmasi_kata_sandi  ? 
							errors.konfirmasi_kata_sandi.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}

						<View style={{ marginTop: 10 }}>
							<Button 
								title="Simpan"
								onPress={ changePassword }
							/>
						</View>

						{ success && (
							<View style={{
								backgroundColor: '#dff0d8',
								padding: 15,
							}}>
								<Text style={{ color: '#3c763d' }}>Berhasil simpan data</Text>
							</View>
						) }
					</View>

					<Text style={{ fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>Perbaharui Token Anda</Text>
					<View style={{ backgroundColor: '#fff', padding: 15 }}>
						<Text style={{ fontWeight: 'bold' }}>Token *</Text>
						<Text>{ token }</Text>

						<View style={{ marginTop: 10 }}>
							<Button 
								title="Generate Token Baru"
								onPress={ generateToken }
							/>
						</View>
					</View>

					<View style={{ marginTop: 25 }}>
						<Button 
							title="Lgout"
							color="#000"
							onPress={ logout }
						/>
					</View>
				</View>
			</ScrollView>
			{ isLoading && (
				<View style={{
					backgroundColor: '#333333', 
					position: 'absolute', 
					width: '100%', 
					height: '100%', 
					justifyContent: 'center', 
					top: 0, 
					left: 0, 
					right: 0,
					bottom: 0,
					zIndex: 999, 
					opacity: 0.7,
				}}>
					<ActivityIndicator color={"#ffffff"} size="large" />
				</View>
			) }
		</SafeAreaView>
	)
}

export default AkunScreen