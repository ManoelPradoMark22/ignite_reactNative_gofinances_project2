import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
  typeTotalTransaction?: 'positive' | 'negative' | 'zero';
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  function getLastTransactionDate(
    collection : DataListProps[],
    type: 'positive' | 'negative'  
  ){
    const dataArray = collection
    .filter(transaction => transaction.type === type)
    .map(transaction => new Date(transaction.date).getTime());
    
    const lastTransaction = new Date(
    Math.max.apply(Math, dataArray));

    return dataArray.length===0 ? '' : `${type==='positive' ? 'Última entrada dia ' : 'Última saída dia '} ${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  function getTotalIntervalTransactionDate(
    collection : DataListProps[],
  ){
    const dateArray = collection.map(transaction => new Date(transaction.date).getTime());

    const lastTransaction = new Date(Math.max.apply(Math, dateArray));

    const lastTransactionFormmated = Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(lastTransaction);

    const firstTransaction = new Date(Math.min.apply(Math, dateArray));

    const firstTransactionFormmated = Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(firstTransaction);

    const firstTransactionYear = firstTransaction.getFullYear();
    const lastTransactionYear = lastTransaction.getFullYear();

    return firstTransactionYear===lastTransactionYear 
      ? `${firstTransactionFormmated} ~ ${lastTransactionFormmated}`
      : `${firstTransactionFormmated}. ${firstTransactionYear} ~ ${lastTransactionFormmated}. ${lastTransactionYear}`;
  }

  function convertToReal(value: number) {
    const string = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return string.replace('R$', 'R$ ');
  }

  function totalTransactionsType(value : number){
    if (value<0) {
      return 'negative';
    } else if (value===0) {
      return 'zero';
    } else {
      return 'positive';
    }
  }

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted : DataListProps[] = transactions
    .map((item : DataListProps) => {

      if(item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      let amount = convertToReal(Number(item.amount));

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    });

    setTransactions(transactionsFormatted);

    const lengthArray = transactions.length;

    const lastTransactionEntries = lengthArray===0 ? '' : getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = lengthArray===0 ? '' : getLastTransactionDate(transactions, 'negative');
    const totalInterval = lengthArray===0 ? '' : getTotalIntervalTransactionDate(transactions);

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: convertToReal(entriesTotal),
        lastTransaction: lastTransactionEntries,
      },
      expensives: {
        amount: convertToReal(expensiveTotal),
        lastTransaction: lastTransactionExpensives,
      },
      total: {
        amount: convertToReal(total),
        lastTransaction: totalInterval,
        typeTotalTransaction: totalTransactionsType(total),
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  },[]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.secondary}
            size="large"
          />
        </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/53825592?v=4' }}/>
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Manoel</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power"/>
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighLightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              typeTotalTransaction={highlightData.total.typeTotalTransaction}
            />
          </HighLightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList 
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
