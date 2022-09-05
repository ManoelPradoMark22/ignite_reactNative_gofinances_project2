import React from 'react';

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

import { ScroolHorizontalText } from '../../global/ComponentsStyled';


export interface CategoryProps {
  _id: string,
  key: string,
  name: string,
  icon: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}

export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps,
  categories: Array<CategoryProps>
}

export function TransactionCard({ data, categories } : Props) {
  const [ category ] = categories.filter(
    item => item.key === data.category
  );

  return (
    <Container>
      <Title>
        {data.name}
        </Title>

      <ScroolHorizontalText style={{marginTop: 2}}>
        <Amount type={data.type}>
          { data.type === 'negative' && '- '}
          { data.amount }
        </Amount>
      </ScroolHorizontalText>

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