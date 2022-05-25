import React, { useEffect, useState } from 'react'
import { View, BackHandler, Text, TextInput, Appearance, Button, ActivityIndicator, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import helpers from '../../Library/helpers.js'

const FormPelanggan = ({ navigation, route }) => {
	const [state, setState] = useState({
		nama: '',
		domisili: '',
		jenis_kelamin: '',
	})

	const [errors, setErrors] = useState({})
	const [disabled, setDisabled] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [uri, setUri] = useState('/pelanggan/store')
	const [method, setMethod] = useState('POST')

	const { type, id } = route.params

	useEffect(() => {
		if(id) {
			setUri(uri => '/pelanggan/update/'+id)
			setMethod('PUT')

			getEditData()
		}

		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [])

	const backAction = () => {
		navigation.goBack()
		return true
	}

	const getEditData = () => {
		setIsLoading(true)

		helpers.getDataUser().then(response  => {
			helpers._api('/pelanggan/edit/'+id, 'GET', response.token).then((json) => {
				const { results } = json
				setState({
					nama: results.nama,
					domisili: results.domisili,
					jenis_kelamin: results.jenis_kelamin,
				})

				setIsLoading(false)
			}).catch((error) => {
				setIsLoading(false)
				showError(error)
			})
		}).catch((error) => {
			setIsLoading(false)
			showError(error)
		})
	}

	const handleChangeValue = (value, name) => {
		setState({
			...state,
			[name]: value
		})
	}

	const saveData = () => {
		setIsLoading(true)

		if(Object.keys(errors).length > 0) {
			setErrors({})
		}

		helpers.getDataUser().then(response  => {
			helpers._api(uri, method, response.token, state).then((json) => {
				if(json.errors) setErrors(json.errors)
				else if(!json.success) showError(json)
				else {
					setSuccess(true)

					if(!id) {
						setState({
							nama: '',
							domisili: '',
							jenis_kelamin: '',
						})
					}
				}

				setIsLoading(false)
			}).catch((error) => {
				setIsLoading(false)
				showError(error)	
			})
		}).catch((error) => {
			setIsLoading(false)
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

	return (
		<View style={{
			flex: 1,
			marginTop: 30,
		}}>
			<View style={{
				paddingTop: 5,
				width: '100%',
				height: 35,
				backgroundColor: '#666',
				paddingLeft: 15,
				paddingRight: 15,
			}}>
				<Text style={{ color: 'white' }}>{ type+' Pelanggan' }</Text>
			</View>

			<View style={{ marginTop: 15, padding: 15, backgroundColor: '#999', }}>
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

				<View>
					<Text style={{ fontWeight: 'bold', color: 'white' }}>Nama *</Text>
					<TextInput 
						style={{ backgroundColor: '#f3f3f3', height: 35, paddingLeft: 10 }}
						value={state.nama}
						onChangeText={(value) => handleChangeValue(value, 'nama')} 
					/>
					{ errors && errors.nama  ? 
						errors.nama.map((value, key) => 
							<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
					        	<Text style={{ color: '#a94442' }}>{ value }</Text>
					      	</View>
						)
						: <Text></Text>
					}
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={{ fontWeight: 'bold', color: 'white' }}>Domisili *</Text>
					<TextInput 
						style={{ backgroundColor: '#f3f3f3', height: 35, paddingLeft: 10 }}
						value={state.domisili} 
						placeholder="Contoh: JAK-UT" 
						onChangeText={(value) => handleChangeValue(value, 'domisili')} 
					/>

					{ errors && errors.domisili  ? 
						errors.domisili.map((value, key) => 
							<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
					        	<Text style={{ color: '#a94442' }}>{ value }</Text>
					      	</View>
						)
						: <Text></Text>
					}
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={{ fontWeight: 'bold', color: 'white' }}>Jenis Kelamin *</Text>
					<Picker
						enabled={ true }
						selectedValue={ state.jenis_kelamin }
						style={{ 
							height: 50,
							...Platform.select({
								android: {
									color: "white"
								},
								ios: {
									color: "white"
								}
			                })
						}}
						onValueChange={(itemValue, itemIndex) => setState({
							...state,
							jenis_kelamin: itemValue,
						})}
					>
						<Picker.Item label="Pilih" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
						
						<Picker.Item label="PRIA" value="PRIA" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
						
						<Picker.Item label="WANITA" value="WANITA" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
					</Picker>
					{ errors && errors.jenis_kelamin  ? 
						errors.jenis_kelamin.map((value, key) => 
							<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
					        	<Text style={{ color: '#a94442' }}>{ value }</Text>
					      	</View>
						)
						: <Text></Text>
					}
				</View>

				<View style={{ marginTop: 10 }}>
					<Button 
						color={ disabled ? '#ccc' : '#00d1b2' }
						title="Simpan"
						onPress={ saveData }
					/>
				</View>
			</View>

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
		</View>
	)
}

export default FormPelanggan