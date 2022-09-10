import React, { useState } from 'react';
import { 
  Modal, 
  ActivityIndicator,
  TouchableWithoutFeedback, 
  Keyboard,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect }  from '../CategorySelect';

import api from '../../services/api'

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';

import { LoadContainer } from '../Resume/styles';

interface FormData {
  name: string;
  amount: string;
}

interface NavigationProps {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Descrição é obrigatória'),
  amount: Yup
  .number()
  .typeError('Informe um valor numérico')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatório')
});

export function Register() {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const navigation = useNavigation<NavigationProps>();

  const { 
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  async function handleRegister(form : FormData) {    
    try {
      if(!transactionType) return Alert.alert("Selecione o tipo da transação!");

      if(category.key === 'category') return Alert.alert("Selecione a categoria!");

      const newTransaction = {
        keyCategory: category.key,
        description: form.name,
        amount: form.amount,
        type: transactionType
      }
      
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await api.post(
        '/statement', 
        newTransaction,
        {
          headers: {
            "cpf": "06350390520"
          }
        }
      );

      const { message, httpStatusCode, data } = response.data;

      //Alert.alert(`${message}(${httpStatusCode})`);

      /*Resetando os campos após o cadastro:*/
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigation.navigate('Listagem', { statement: data });


    } catch (error){
      if(error.response) return Alert.alert(`${error.response.data.message}(${error.response.status})`);
      
      Alert.alert("Não foi possível salvar!");
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        {
          isLoading ? 
          <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.secondary}
              size="large"
            />
          </LoadContainer> :
          <Form>
            <Fields>
              <InputForm
                name="name"
                control={control}
                placeholder="Descrição"
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.name && errors.name.message}
              />
  
              <InputForm
                name="amount"
                control={control}
                placeholder="Preço"
                keyboardType="numeric"
                error={errors.amount && errors.amount.message}
              />
  
              <TransactionsTypes>
                <TransactionTypeButton
                  type="up"
                  title="Entrada"
                  onPress={() => handleTransactionsTypeSelect('positive')}
                  isActive={transactionType === 'positive'}
                />
                <TransactionTypeButton
                  type="down"
                  title="Saída"
                  onPress={() => handleTransactionsTypeSelect('negative')}
                  isActive={transactionType === 'negative'}
                />
              </TransactionsTypes>
  
              <CategorySelectButton 
                title={category.name}
                onPress={handleOpenSelectCategoryModal}
              />
            </Fields>
            
            <Button 
              title="Enviar"
              onPress={handleSubmit(handleRegister)}
            />
          </Form>
        }
        
        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  )
}