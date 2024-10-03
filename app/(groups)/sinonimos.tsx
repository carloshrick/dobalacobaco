import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput } from "react-native";
import styled from "styled-components/native";
import apiConfig from '../../api/axios';
import { Link as ExpoRouterLink } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function NewGroup() {
    const [sinonimosData, setSinonimosData] = useState<{ [key: string]: { sinonimos: string[] } }>({});
    const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a busca
    const [filteredData, setFilteredData] = useState<string[]>([]); // Estado para armazenar os dados filtrados
    
    useEffect(() => {
        async function fetchSinonimos() {
            try {
                const response = await apiConfig.get('/sinonimos');
                setSinonimosData(response.data);
            } catch (error) {
                console.error('Erro ao buscar sinônimos:', error);
            }
        }
        fetchSinonimos();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = Object.keys(sinonimosData).filter(item => 
                item.toLowerCase().includes(searchQuery.toLowerCase()) // Filtra palavras com base na pesquisa
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(Object.keys(sinonimosData)); // Mostra tudo se não houver busca
        }
    }, [searchQuery, sinonimosData]);

    const navigation = useNavigation();

    return (
        <ContainerBody>
            <Container>
                <Title>Sinônimos</Title>
            </Container>
                
            <Inputizin 
                placeholder='Pesquisar'
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)} // Atualiza a busca em tempo real
            />

            <ContentContainer>
                <FlatList
                    data={filteredData} // Dados filtrados pela pesquisa
                    keyExtractor={(item) => item} // A chave é a própria palavra
                    renderItem={({ item }) => (
                        <Card>
                            <CardTitle>{item}</CardTitle>
                            <SinonimosList>
                                {sinonimosData[item]?.sinonimos?.map((sinonimo, index) => (
                                    <SinonimoItem key={index}>{sinonimo}</SinonimoItem>
                                )) || (
                                    <SinonimoItem>Nenhum sinônimo disponível</SinonimoItem>
                                )}
                            </SinonimosList>
                        </Card>
                    )}
                />
            </ContentContainer>

            <Footer>
                <ButtonContainer href='/(groups)'>
                    <Icone source={require('../../assets/botao-de-inicio.png')} />
                </ButtonContainer>
                <ButtonContainer1 onPress={() => navigation.goBack()}>
                    <Icone source={require('../../assets/back-button.png')} />
                </ButtonContainer1>
            </Footer>
        </ContainerBody>
    );
}

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
`;

const Container = styled.View`
    padding: 10px;
    align-items: center;
    margin-top: 30px;
`;

const Inputizin = styled.TextInput`
    font-size: 20px;
    background-color: #dcdcdc;
    width: 250px;
    height: 40px;
    border-radius: 30px;
    padding: 10px;
    margin-bottom: 20px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
    margin-top: -30px;
`;

const Footer = styled.View`
    width: 100%;
    position: absolute;
    bottom: 0;
    flex-direction: row;
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 90px;
`;

const ButtonContainer = styled(ExpoRouterLink)`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    padding-left: 20px;
    margin-top: 20px;
`;

const ButtonContainer1 = styled.TouchableOpacity`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    padding-left: 20px;
    margin-top: 20px;
`;

const Icone = styled.Image`
    border-radius: 8px;
    width: 30px;
    height: 30px;
`;

const Card = styled.View`
    background-color: white;
    border-radius: 8px;
    margin: 10px;
    padding: 10px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
    width: 370px; 
`;

const CardTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #18206f;
`;

const SinonimosList = styled.View`
    margin-top: 10px;
    padding: 5px;
`;

const SinonimoItem = styled.Text`
    font-size: 16px;
    text-align: center;
    color: #555;
`;

const ContentContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 100px;
`;
