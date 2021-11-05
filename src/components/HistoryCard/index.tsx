import React from 'react';
import { View } from 'react-native';
import TextTicker from 'react-native-text-ticker';

import { 
  Container,
  PercentBox,
  Percent,
  Content,
  Title,
  BoxAmount,
  Amount
} from './styles';

import { ScroolHorizontalText } from '../../global/ComponentsStyled';

interface Props {
  title: string;
  amount: string;
  color: string;
  percent: string;
}

export function HistoryCard({
  title,
  amount,
  color,
  percent
} : Props) {
  return (
    <Container color={color}>
      <PercentBox color={color} style={{alignItems: 'center'}}>
        <View style={{flex: 1 , alignItems: 'center', justifyContent: 'center'}}>
          <Percent>{percent}</Percent>
        </View>
      </PercentBox>
      <Content>
        <View style={{ flex: 1 }}>
          <ScroolHorizontalText>
            <Title>{title}</Title>
          </ScroolHorizontalText>
        </View>
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
      </Content>
    </Container>
  )
}