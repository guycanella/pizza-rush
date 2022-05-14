import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'

import { useAuth } from '@hooks/auth'

import brandImg from '@assets/brand.png'

import Input from '@components/Input'
import Button from '@components/Button'

import {
	Brand,
	Container,
	Content,
	ForgotPasswordButton,
	ForgotPasswordLabel,
	Title
} from './styles'

const SignIn = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { signIn, isLogging, forgotPassword } = useAuth()

	const handleSignIn = () => {
		signIn(email, password)
	}

	const handleForgotPassword = () => {
		forgotPassword(email)
	}

	return (
		<Container>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<Content>
					<Brand  source={brandImg} />
					<Title>Login</Title>
					<Input
						placeholder='E-mail'
						type='secondary'
						autoCorrect={false}
						autoCapitalize='none'
						onChangeText={setEmail}
					/>

					<Input
						placeholder='Senha'
						type='secondary'
						secureTextEntry
						onChangeText={setPassword}
					/>

					<ForgotPasswordButton onPress={handleForgotPassword}>
						<ForgotPasswordLabel>
							Esqueci minha senha
						</ForgotPasswordLabel>
					</ForgotPasswordButton>

					<Button
						title="Entrar"
						type='secondary'
						onPress={handleSignIn}
						isLoading={isLogging}
					/>
				</Content>
			</KeyboardAvoidingView>
		</Container>
	)
}

export default SignIn
