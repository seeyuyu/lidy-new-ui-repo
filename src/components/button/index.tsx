import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styled from "styled-components"
const NyButton = styled.button({
	color: "red",
});
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

function Button(props: PropsWithChildren<ButtonProps>) {
	const { children, ...rest } = props;
	return <NyButton {...rest}>{children}</NyButton>;
}
export default Button;