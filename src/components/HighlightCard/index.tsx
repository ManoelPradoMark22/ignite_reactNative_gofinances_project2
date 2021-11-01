import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components';

import { 
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction
} from './styles';

import { ScroolHorizontalText } from '../../global/ComponentsStyled';

interface Props{
  type: 'up' | 'down' | 'total';
  title: string;
  amount: string;
  lastTransaction: string;
  typeTotalTransaction?: 'positive' | 'negative' | 'zero';
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign',
}

export function HighlightCard({
  type,
  title,
  amount,
  lastTransaction,
  typeTotalTransaction
} : Props) {
  const theme = useTheme();

  function chooseColor1() {
    if (type==='total') {
      return theme.colors.primary
    } else {
      return theme.colors.shape
    }
  }

  function chooseColor2() {
    if (type==='total') {
      switch(typeTotalTransaction){
        case 'negative':
          return theme.colors.attention;
          break;
        case 'zero':
          return theme.colors.secondary;
          break;
        case 'positive':
          return theme.colors.success;
          break;   
        default:
          return theme.colors.secondary;   
          break;    
      }
    } else {
      return theme.colors.shape
    }
  }

  return (
    <View>
      <Container color1={chooseColor1()} color2={chooseColor2()}> 
        <Header>
          <Title type={type}>
            {title}
          </Title>
          <Icon 
            name={icon[type]} 
            type={type}
          />
        </Header>
        
        <Footer>
          <ScroolHorizontalText style={{marginTop: 38}}>
            <Amount type={type}>
              {amount}
            </Amount>
          </ScroolHorizontalText>
          <LastTransaction type={type}>
            {lastTransaction}
          </LastTransaction>
        </Footer>
        
      </Container>
    </View>
  )
}