import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';
import getRealm from '~/services/realm';

import Repositorio from '~/components/Repositorio';

import {Container, Title, Form, Input, Submit, List} from './styles';

export default function Main() {
  //isso é hooks
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [repositorios, setRepositorios] = useState([]);

  //passando para o useEffect como primeiro parâmetro a função que vai executar
  //e como segundo parâmentro um array vazio esse hook vai executar apenas uma vez
  //a função executa quando o segundo parâmetro mudar, em um array vazio esse parâmentro não muda
  //por isso executa apenas umas vez.
  useEffect(() => {
    async function carregarRespositorios() {
      const realm = await getRealm();
      const data = realm.objects('Repositorio').sorted('stars', true);
      //realm usa observers..toda vez que o data mudar ele executar novamente a função
      setRepositorios(data);
    }
    carregarRespositorios();
  }, []);

  async function saveRepositorio(repositorio) {
    const data = {
      id: repositorio.id,
      name: repositorio.name,
      fullName: repositorio.full_name,
      description: repositorio.description,
      stars: repositorio.stargazers_count,
      forks: repositorio.forks_count,
    };
    //conexão com o Realm
    const realm = await getRealm();

    //todo create, update ou remove deve ser encapsulado em um write
    realm.write(() => {
      //aqui dentro da conexão com a base de dados está aberta.
      realm.create('Repositorio', data, 'modified');
    });
    return data;
  }

  //por causa dos hooks pode declarar aqui dentro mesmo
  async function handleAddRespositorio() {
    try {
      const response = await api.get(`/repos/${input}`);
      await saveRepositorio(response.data);
      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
    }
  }

  async function handleAtualizarRepositorios(repositorio) {
    const response = await api.get(`/repos/${repositorio.fullName}`);
    const data = await saveRepositorio(response.data);
    setRepositorios(
      repositorios.map(repo => (repo.id === data.id ? data : repo)),
    );
  }
  return (
    <Container>
      <Title>Repositórios</Title>

      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Procurar repositório..."
        />
        <Submit onPress={handleAddRespositorio}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>
      <List
        //fecha o teclado quando clicar na lista.
        KeyboardShouldPersistTaps="handled"
        data={repositorios}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Repositorio
            data={item}
            onRefresh={() => handleAtualizarRepositorios(item)}
          />
        )}
      />
    </Container>
  );
}
