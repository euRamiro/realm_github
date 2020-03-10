import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Container,
  Nome,
  Descricao,
  Stats,
  Stat,
  StatCount,
  Refresh,
  RefreshText,
} from './styles';

export default function Repositorio({data, onRefresh}) {
  return (
    <Container>
      <Nome>{data.name}</Nome>
      <Descricao>{data.descr}</Descricao>
      <Stats>
        <Stat>
          <Icon name="star" size={16} color="#333" />
          <StatCount>{data.stars}</StatCount>
        </Stat>
        <Stat>
          <Icon name="code-fork" size={16} color="#333" />
          <StatCount>{data.forks}</StatCount>
        </Stat>
      </Stats>
      <Refresh onPress={onRefresh}>
        <Icon name="refresh" color="#7159c1" size={16} />
        <RefreshText>Atualizar</RefreshText>
      </Refresh>
    </Container>
  );
}
