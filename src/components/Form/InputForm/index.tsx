import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';

import { Input } from '../Input';

import { Container } from './styles';

interface Props extends TextInputProps {
  control: Control;
  name: string;
}

export function InputForm({
  control,
  name,
  ...rest
} : Props) {

  /*
    - control -> quem ta controlando? que formulario ta controlando esse input?
    control é essa informacao.
    é como que react-hook-form vai identificar (como se fosse uma assinatura), para q 
    o react-hook-form entenda que os inputs fazem parte do mesmo formulario,
    para quando clicar no botao de enviar, envia as informacoes desses inputs
    - render -> qual input que vou renderizar q vai ser CONTROLADO.
    ai estamos usando nosso componente de input passando tds as props {...rest}
    e para renderizar o input podemos acessar props do field do input 
    (onChange, onBlur, value etc etc)
    ou seja, no render vai ser RENDERIZADO como um input CONTROLADO o componente
    de input q estamos passando
  */

  return (
    <Container>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={onChange}
            value={value}
            {...rest}
          />
        )}
      />
    </Container>
  )
}

