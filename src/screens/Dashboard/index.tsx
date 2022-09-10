import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import api from '../../services/api'
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps, CategoryProps } from '../../components/TransactionCard';

import emptyListImage from '../../assets/opps.png';

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
  HeaderTransactions,
  Title,
  TransactionList,
  PressButton,
  LoadContainer,
  ImageContainer,
  ImageEmpty
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}
export interface StatementProps {
  _id: string,
  accountCpf: string,
  keyCategory: string,
  description: string,
  amount: number,
  type: 'positive' | 'negative',
  createdAt: string,
  updatedAt: string,
  __v: number
}

interface HighlightProps {
  amount: string;
  amountNumber: number,
  lastTransaction: string;
  typeTotalTransaction?: 'positive' | 'negative' | 'zero';
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

const emptyHighlightProps = () : HighlightProps => ({
  amount: 'R$ 0,00',
  amountNumber: 0,
  lastTransaction: '',
  typeTotalTransaction: 'zero'
})

const emptyHighlightData = () : HighlightData => ({
  entries: emptyHighlightProps(),
  expensives: emptyHighlightProps(),
  total: emptyHighlightProps()
});

export function Dashboard({ navigation, route }) {
  const theme = useTheme();

  //reduzir o numero de useStates. manter o essencial (transactions talvez seria o essencial?)
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [firstTransactionDate, setfirstTransactionDate] = useState(new Date());
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(emptyHighlightData());

  if(route) {
    if(route.params){
      if(route.params.statement){  
        const objStatement = route.params.statement;

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(objStatement.createdAt));

        setTransactions([
          {
            id: objStatement._id,
            name: objStatement.description,
            amount: convertToReal(objStatement.amount),
            type: objStatement.type,
            category: objStatement.keyCategory,
            date
          }, ...transactions
        ]);

        let newHighlightData = {
          ...highlightData
        };
        
        let entries = highlightData.entries.amountNumber;
        let expensives = highlightData.expensives.amountNumber;
        
        const lastTransaction = new Date();
        const textDataInOut = `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
        if(objStatement.type==='negative')  {
          expensives += objStatement.amount;
          newHighlightData.expensives.amount = convertToReal(expensives);
          newHighlightData.expensives.amountNumber = expensives;
          newHighlightData.expensives.lastTransaction = `Última saída dia ${textDataInOut}`;
        }else {
          entries += objStatement.amount;
          newHighlightData.entries.amount = convertToReal(entries);
          newHighlightData.entries.amountNumber = entries;
          newHighlightData.entries.lastTransaction = `Última entrada dia ${textDataInOut}`;
        }
        
        const lastTransactionFormmated = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'short',
        }).format(lastTransaction);

        const firstTransactionFormmated = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'short',
        }).format(firstTransactionDate);

        const firstTransactionYear = firstTransactionDate.getFullYear();
        const lastTransactionYear = lastTransaction.getFullYear();

        let total = entries - expensives;
        newHighlightData.total.amount = convertToReal(total);
        newHighlightData.total.amountNumber = total;
        newHighlightData.total.lastTransaction = firstTransactionYear===lastTransactionYear 
        ? `${firstTransactionFormmated} ~ ${lastTransactionFormmated}`
        : `${firstTransactionFormmated}. ${firstTransactionYear} ~ ${lastTransactionFormmated}. ${lastTransactionYear}`;
        newHighlightData.total.typeTotalTransaction = totalTransactionsType(total);
        
        setHighlightData(newHighlightData);

        delete route.params.statement;
      }
    }
  }

  function getLastTransactionDate(
    collection : StatementProps[],
    type: 'positive' | 'negative'  
  ){
    const todayDateYear = (new Date()).getFullYear();

    const dataArray = collection
    .filter(transaction => transaction.type === type)
    .map(transaction => new Date(transaction.createdAt).getTime());

    
    const lastTransaction = new Date(
    Math.max.apply(Math, dataArray));

    const lastTransactionYear = lastTransaction.getFullYear();

    return dataArray.length===0 ? '' : `${type==='positive' ? 'Última entrada dia ' : 'Última saída dia '} ${lastTransaction.getDate()} de ${todayDateYear === lastTransactionYear ? lastTransaction.toLocaleString('pt-BR', { month: 'long' }) : lastTransaction.toLocaleString('pt-BR', { month: 'short' })+' de '+ lastTransactionYear}`;
  }

  function getTotalIntervalTransactionDate(
    collection : StatementProps[],
  ){
    const dateArray = collection.map(transaction => new Date(transaction.createdAt).getTime());

    const lastTransaction = new Date(Math.max.apply(Math, dateArray));

    const lastTransactionFormmated = Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(lastTransaction);

    const firstTransaction = new Date(Math.min.apply(Math, dateArray));
    setfirstTransactionDate(firstTransaction);

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

  function handleConfirmAllDelete() {
    Alert.alert(
      "Deletar todos os statements!",
      "Tem certeza que quer deletar todos os statements?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirmar", onPress: () => deleteAllStatements() }
      ]
    );
  }

  async function deleteAllStatements(){

    try{
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await api('/statement', {
        method: 'DELETE',
        headers: {
          "cpf": "06350390520"
        }
      });
      setTransactions([]);
      setHighlightData(emptyHighlightData);
      setRefresh(!refresh);
      Alert.alert(`${response.data.name} - ${response.data.message}(${response.data.httpStatusCode})`);
    }catch(error) {
      if(error.response) return Alert.alert(`${error.response.data.message}(${error.response.status})`);
      Alert.alert('Error!');
    }finally{
      setIsLoading(false);
    }
  }


  async function loadTransactions(){
    try{
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await api('/full-dashboard', {
        method: 'GET',
        headers: {
          "cpf": "06350390520"
        }
      });
      
      const { data } = response.data;

      if(!data) return Alert.alert(`${response.data.message}(${response.data.httpStatusCode})`);

      //Alert.alert(`${response.data.message}(${response.data.httpStatusCode})`);

      const { statements: transactions, balance, categories } = data;

      const transactionsFormatted : DataListProps[] = transactions
      .map((item : StatementProps) => {

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.createdAt));

        return {
          id: item._id,
          name: item.description,
          amount: convertToReal(item.amount),
          type: item.type,
          category: item.keyCategory,
          date
        }
      });

      setCategories(categories);
      setTransactions(transactionsFormatted);

      const lengthArray = transactions.length;

      const lastTransactionEntries = lengthArray===0 ? '' : getLastTransactionDate(transactions, 'positive');
      const lastTransactionExpensives = lengthArray===0 ? '' : getLastTransactionDate(transactions, 'negative');
      const totalInterval = lengthArray===0 ? '' : getTotalIntervalTransactionDate(transactions);


      setHighlightData({
        entries: {
          amount: convertToReal(balance.inflow),
          amountNumber: balance.inflow,
          lastTransaction: lastTransactionEntries,
        },
        expensives: {
          amount: convertToReal(balance.outflow),
          amountNumber: balance.outflow,
          lastTransaction: lastTransactionExpensives,
        },
        total: {
          amount: convertToReal(balance.total),
          amountNumber: balance.total,
          lastTransaction: totalInterval,
          typeTotalTransaction: totalTransactionsType(balance.total),
        }
      });
    }catch(error){
      if(error.response) return Alert.alert(`${error.response.data.message}(${error.response.status})`);
      
      Alert.alert("Não foi possível carregar!");
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  },[]);

  return (
    <Container>
      {
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

              <PressButton onPress={() => {}}>
                <Icon name="power"/>
              </PressButton>
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
            <HeaderTransactions>
              <Title>Listagem</Title>
              {
                transactions.length>0 && (
                  <PressButton onPress={handleConfirmAllDelete}>
                    <Icon name='trash-2'/>
                  </PressButton>
                )
              }
            </HeaderTransactions>
            {
              isLoading ? 
              <LoadContainer>
                <ActivityIndicator 
                  color={theme.colors.secondary}
                  size="large"
                />
              </LoadContainer> :
              <TransactionList 
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} categories={categories}/>}
                ListEmptyComponent={
                  <ImageContainer>
                    <ImageEmpty source={emptyListImage}/>
                  </ImageContainer>}
              />
            }
          </Transactions>
        </>
      }
    </Container>
  )
}
