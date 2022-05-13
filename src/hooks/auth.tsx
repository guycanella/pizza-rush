import React,
	{ createContext,
		useContext,
		ReactNode
} from 'react'

type AuthContextData = {

}

type AuthProviderProps = {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

const AuthProvider = ({ children }: AuthProviderProps) => {
	return (
		<AuthContext.Provider value={{}}>
			{children}
		</AuthContext.Provider>
	)
}

const useAuth = () => {
	const context = useContext(AuthContext)
}

export { AuthProvider, useAuth }
