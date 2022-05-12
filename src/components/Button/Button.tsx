import React from 'react'

import { Container, Title, Load } from './styles'

import type { RectButtonProps } from 'react-native-gesture-handler'
import type { TypeProps } from '../Input/styles'

type Props = RectButtonProps & {
	title: string
	type?: TypeProps
	isLoading?: boolean
}

const Button = ({
	title,
	type = 'primary',
	isLoading = false,
	...rest
}: Props) => {
	return (
		<Container type={type} enabled={isLoading} {...rest}>
			{isLoading ? <Load /> : <Title>{title}</Title>}
		</Container>
	)
}

export default Button
