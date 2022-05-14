import React,
	{ createContext,
		useContext,
		ReactNode,
		useState,
		useEffect
} from 'react'
import { Alert } from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

type User = {
	id: string
	name: string
	isAdmin: boolean
}

export type AuthContextData = {
	signIn: (email: string, password: string) => Promise<void>
	signOut: () => Promise<void>
	forgotPassword: (email: string) => Promise<void>
	isLogging: boolean
	user: User | null
}

type AuthProviderProps = {
	children: ReactNode
}

const USER_COLLECTION = '@pizzahush:users'

export const AuthContext = createContext({} as AuthContextData)

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [isLogging, setIsLogging] = useState(false)
	const [user, setUser] = useState<User | null>(null)

	const signIn = async (email: string, password: string) => {
		if (!email || !password) {
			return Alert.alert('Login', 'Informe o e-mail e a senha.')
		}

		setIsLogging(true)

		auth().signInWithEmailAndPassword(email, password)
			.then(account => {
				firestore()
					.collection('users')
					.doc(account.user.uid)
					.get()
					.then(async (profile) => {
						const { name, isAdmin } = profile.data() as User

						if(profile.exists) {
							const userData = {
								id: account.user.uid,
								name,
								isAdmin
							}

							await AsyncStorage
								.setItem(USER_COLLECTION, JSON.stringify(userData))
							setUser(userData)
						}
					})
					.catch(error => {
						Alert.alert('Login','Não foi possível buscar os dados de perfil do usuário.')
					})
			})
			.catch(error => {
				const { code } = error

				if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
					return Alert.alert('Login', 'E-mail e/ou senha inválida.')
				}

				return Alert.alert('Login', 'Não foi possível realizar o login.')
			})
			.finally(() => {
				setIsLogging(false)
			})
	}

	const signOut = async () => {
		await auth().signOut()
		await AsyncStorage.removeItem(USER_COLLECTION)
		setUser(null)
	}

	const loadUserStorageData = async () => {
		setIsLogging(true)

		const storedUser = await AsyncStorage.getItem(USER_COLLECTION)

		if (storedUser) {
			const userData: User = JSON.parse(storedUser)
			setUser(userData)
		}

		setIsLogging(false)
	}

	const forgotPassword = async (email: string) => {
		if (!email) {
			return Alert.alert('Redefinir senha', 'Informe o e-mail.')
		}

		auth()
			.sendPasswordResetEmail(email)
			.then(() =>
				Alert.alert('Redefinir senha', 'Enviamos um link no seu e-mail.')
			)
			.catch(() =>
				Alert.alert('Redefinir senha', 'Não foi possível enviar o e-mail.')
			)
	}

	useEffect(() => {
		loadUserStorageData()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				signOut,
				isLogging,
				forgotPassword
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

const useAuth = () => {
	const context = useContext(AuthContext)

	return context
}

export { AuthProvider, useAuth }
