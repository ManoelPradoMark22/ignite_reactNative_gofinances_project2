import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components';
import TextTicker from 'react-native-text-ticker';

import { 
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction
} from './styles';

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
          <View style={{ marginTop: 38 }}>
            <TextTicker
              duration={5000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              <Amount type={type}>
                {amount}
              </Amount>
            </TextTicker>
          </View>
          <LastTransaction type={type}>
            {lastTransaction}
          </LastTransaction>
        </Footer>
        
      </Container>
    </View>
  )
}