import React from 'react';
import { View } from 'react-native';
import TextTicker from 'react-native-text-ticker';

import { 
  Container,
  Title,
  BoxAmount,
  Amount
} from './styles';

import { ScroolHorizontalText } from '../../global/ComponentsStyled';

interface Props {
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({
  title,
  amount,
  color
} : Props) {
  return (
    <Container color={color}>
      <ScroolHorizontalText style={{ flex: 1 }}>
        <Title>{title}</Title>
      </ScroolHorizontalText>
      <BoxAmount>
        <TextTicker
          duration={5000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
        >
          <Amount>{amount}</Amount>
        </TextTicker>
      </BoxAmount>
    </Container>
  )
}