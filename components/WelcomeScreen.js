import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Button  } from 'react-native'
import helpers from "../Library/helpers.js"

global.routeName = null

const WelcomeScreen = ({navigation}) => {
	const [loginClick, setLoginClick] = useState(false)
	const [state, setState] = useState({
		email: '',
		password: '',
	})
	const [loading, setLoading] = useState(true)
	const [errors, setErrors] = useState({})
	const [counter, setCounter] = useState(0)

	useEffect(() => {
		welcomePage()

		setCounter(counter + 1)

		setTimeout(() => {
			setCounter(0)
		}, 1200)
		
		setTimeout(() => {
			const willFocusSubscription = navigation.addListener('focus', () => {
				if(counter < 1) {
					setLoading(true)

		        	setTimeout(() => {
		        		welcomePage();
		        	}, 1000)
		    	}
		    })

		    return willFocusSubscription
		}, 1000)
	}, [])

	const welcomePage = () => {
		helpers.isLogin(navigation).catch((error) => {
			setErrors({
				systemError: error.message
			})
		})

		setTimeout(() => {
			setLoading(false)
		}, 1000)
	}

	const handleChangeValue = (event, column) => {
		setState({
			...state,
			[column]: event
		})
	}

	const signIn = (event) => {
		event.preventDefault()

		if(Object.keys(errors).length > 0) setErrors({})

		setLoginClick(true)

		if(!loginClick) {
			helpers._api('/login', 'POST', null, state).then((json) => {
				if(json.errors) setErrors(json.errors)
				else if(!json.success)  setErrors({
					email: [json.message]
				})
				else {
					helpers.saveDataUser(json.results)

					navigation.navigate('Layout')

					setState({
						email: '',
						password: '',
					})
				}

				setLoginClick(false)
			}).catch((error) => {
				setErrors({
					systemError: error.message
				})

				setTimeout(() => {
					setErrors({})
				}, 3000)

				setLoginClick(false)
			})
		}
	}

	return (
		<View style={ styles.container }>
			{ !loading && (
				<View style={ styles.welcomeBox }>
					<Text style={ styles.welcomeText }>Selamat datang di Mini Project Ronny</Text>
					<Text style={ [styles.white, styles.center, styles.mt17] }>Silahkan Login menggunakan User yang sudah</Text>
					<Text style={ [styles.white, styles.center] }>di create melalui artisan db:seed di project mini API</Text>

					<View style={ styles.mt17 }>
						{errors && errors.systemError && (
							<View style={ styles.errorBox }>
								<Text style={ styles.errorText }>{ errors.systemError }</Text>
							</View>
						)}

						<Text style={ styles.white }>Email *</Text>
						<TextInput 
							style={ styles.textInput }
							onChangeText={ (event) => handleChangeValue(event, 'email') }
							value={ state.email.toLowerCase() }
						/>

						{ errors && errors.email  ? 
							errors.email.map((value, key) => 
								<Text style={styles.errorText } key={ key }>{ value }</Text>
							)
							: <Text></Text>
						}

						<Text style={ [styles.white, styles.mt17] }>Password *</Text>
						<TextInput 
							style={ styles.textInput }
							secureTextEntry={ true }
							onChangeText={ (event) => handleChangeValue(event, 'password') }
							value={ state.password }
							autoCapitalize='none'
						/>

						{ errors && errors.password  ? 
							errors.password.map((value, key) => 
								<Text style={styles.errorText } key={ key }>{ value }</Text>
							)
							: <Text></Text>
						}

						<View style={ styles.mt17 }>
							<Button 
								title="Login"
								color={ loginClick ? '#ccc' : '#00d1b2' }
								onPress={ signIn }
							/>
						</View>
					</View>
				</View>
			) }
		</View>
	)
}

export default WelcomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},

	welcomeBox: {
		backgroundColor: '#1a202c',
		padding: 15,
		
		/*For Android Box Shadow*/
		elevation: 12,

		/*For IOS Box Shadow*/
		shadowColor: '#000',
	    shadowOffset: { width: 0, height: 1 },
	    shadowOpacity: 0.8,
	    shadowRadius: 1,
	},

	welcomeText: {
		fontWeight: 'bold',
		color: '#f3f3f3',
		textAlign: 'center',
	},

	mt17: {
		marginTop: 17
	},

	white: {
		color: '#fff',
	},

	center: {
		textAlign: 'center',
	},

	textInput: {
		backgroundColor: '#fff',
		marginTop: 10,
		height: 38,
		paddingLeft: 10,
	},

	errorBox: {
		backgroundColor: '#f2dede',
		padding: 15,
	},

	errorText: {
		color: '#A94433'
	}
});