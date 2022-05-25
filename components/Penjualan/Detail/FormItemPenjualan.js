import React, { useEffect, useState } from 'react'
import { View, BackHandler, Text, TextInput, Appearance, Button, ActivityIndicator, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import helpers from '../../../Library/helpers.js'

const FormItemPenjualan = ({ navigation, route }) => {
	const [state, setState] = useState({
		kode_barang: '',
		qty: '',
	})

	const [errors, setErrors] = useState({})
	const [disabled, setDisabled] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [uri, setUri] = useState('')
	const [method, setMethod] = useState('POST')
	const [items, setItems] = useState([])

	const { type, nota, kode_barang, nota_id } = route.params

	useEffect(() => {
		if(nota && kode_barang) {
			setUri(uri => '/item-penjualan/update/'+nota+'/'+kode_barang)
			setMethod('PUT')

			getEditData()
		}

		if(nota_id) {
			setUri(uri => '/item-penjualan/store/'+nota_id)
		}

		getListOfBarang()

		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [])

	const backAction = () => {
		navigation.goBack()
		return true
	}

	const getListOfBarang = () => {
		helpers.getDataUser().then(response => {
			helpers._api('/barang/list', 'GET', response.token).then((json) => {
				setItems(Object.entries(json.results))
			}).catch((error) => {
				showError(error)
			})
		}).catch((error) => {
			showError(error)
		})
	}

	const getEditData = () => {
		setIsLoading(true)

		helpers.getDataUser().then(response  => {
			helpers._api('/item-penjualan/edit/'+nota+'/'+kode_barang, 'GET', response.token).then((json) => {
				const { results } = json

				setState({
					kode_barang: results.kode_barang,
					qty: results.qty.toString()
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
							kode_Barang: '',
							qty: '',
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
				<Text style={{ color: 'white' }}>{ type+' Item Penjualan' }</Text>
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
					<Text style={{ fontWeight: 'bold', color: 'white' }}>Kode Barang *</Text>
					<Picker
						enabled={ true }
						selectedValue={ state.kode_barang }
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
							kode_barang: itemValue,
						})}
					>
						<Picker.Item label="Pilih" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
						{ items.map((value, key) => (
							<Picker.Item label={ value[1] } key={ key } value={ value[0] } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
						)) }
					</Picker>
					{ errors && errors.kode_barang  ? 
						errors.kode_barang.map((value, key) => 
							<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
					        	<Text style={{ color: '#a94442' }}>{ value }</Text>
					      	</View>
						)
						: <Text></Text>
					}
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={{ fontWeight: 'bold', color: 'white' }}>Qty *</Text>
					<TextInput 
						style={{ backgroundColor: '#f3f3f3', height: 35, paddingLeft: 10 }}
						value={state.qty} 
						onChangeText={(value) => handleChangeValue(value, 'qty')} 
					/>

					{ errors && errors.qty  ? 
						errors.qty.map((value, key) => 
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

export default FormItemPenjualan