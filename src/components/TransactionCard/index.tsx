import React from 'react';
import { categories } from '../../utils/categories';

import { 
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date
} from './styles';


export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({ data } : Props) {
  /*como o filter retorna um array, usamos [category] para pegar a primeira 
  posicao (ja que sabemos que vai retornar um array com apenas 1 elemento - 
  ja q em categories nao temos keys repetidas!
  seria o mesmo de escrever: 
  const category = categories.filter(
    item => item.key === data.category
  )[0];
  */
  const [ category ] = categories.filter(
    item => item.key === data.category
  );

  return (
    <Container>
      <Title>
        {data.name}
        </Title>

      <Amount type={data.type}>
        { data.type === 'negative' && '- '}
        { data.amount }
      </Amount>

      <Footer>
        <Category>
          <Icon name={category.icon}/>
          <CategoryName>
            {category.name}
          </CategoryName>
        </Category>

        <Date>
          {data.date}
        </Date>
      </Footer>
    </Container>
  )
}