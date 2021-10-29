import React from 'react';

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
  return (
    <Container type={type} typeTotalTransaction={typeTotalTransaction}>
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
        <Amount type={type}>
          {amount}
        </Amount>
        <LastTransaction type={type}>
          {lastTransaction}
        </LastTransaction>
      </Footer>
      
    </Container>
  )
}