import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface ColorProps {
  color: string;
}

export const Container = styled.View<ColorProps>`
  width: 100%;

  background-color: ${({ theme }) => theme.colors.shape};

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-radius: 5px;
  border-right-width: 5px;
  border-right-color: ${({ color }) => color};

  margin-bottom: 8px;
`;

export const PercentBox = styled.View<ColorProps>`
  background-color: ${({ color }) => color};
  min-width: 42px;
  margin-right: 5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export const PercentFlexBox = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Percent = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
`;

export const Content = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  
  padding: 13px 0;
  padding-right: 24px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;
`;

export const BoxAmount = styled.View`
  flex: 1;
  flex-direction: row-reverse;
  margin-right: 5px;
`;

export const Amount = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(15)}px;
`;