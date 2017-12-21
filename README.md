Valburguer
==========

Finalmente um app para pedir o melhor hambúrguer da cidade!

## Aviso Legal

Este app é o resultado unicamente de um processo seletivo aplicado pela empresa DSIN, não tendo qualquer relação com marcas ou outros aplicativos reais.

## Sobre

O Valburguer é um controlador de pedidos para a hamburgueria do Sr. Valbernielson (personagem e local fictícios). Inicialmente pensando para permitir que pessoas façam e alterem pedidos, algumas tarefas mais avançadas (como administração de pedidos pela lanchonete) não puderam ser completadas a tempo.

O diagrama do modelo de dados utilizado para o aplicativo encontra-se em <pasta do projeto>/db/valburguer.mwb e pode ser aberto utilizando-se a ferramenta [MySQL Workbench](https://dev.mysql.com/downloads/workbench/).

Creio que cabe ressaltar que o app foi desenvolvido tendo em mente um design responsivo, podendo ser utilizado tanto em computadores quanto em dispositivos móveis.

No mais, outro ponto positivo é o fato de o servidor ter sido desenvolvido com arquitetura REST. Desta forma, chamadas externas ao app podem ser feitas por outros aplicativos e sites, como: listagem do menu, exibição de status de pedido etc. Além disso, a arquitetura proporciona a versatilidade de se poder trocar a camada de view por outra, sem que seja necessário trocar o servidor (desde que seja mantido o padrão de troca de mensagens no formato JSON, claro).

#### Requisitos:
- [Java JDK 8](http://www.oracle.com/technetwork/pt/java/javase/downloads/jdk8-downloads-2133151.html)
- [Apache Tomcat 8.5](https://tomcat.apache.org/download-80.cgi)
- [MySQL (v5.6 ou superior)](https://dev.mysql.com/downloads/mysql/)

Este app foi desenvolvido com o Eclipse for JAVA EE Developers Oxygen

## Configuração

Para rodar o projeto compilado, basta jogar o arquivo <pasta do projeto>/target/valburguer.war na pasta webapps do diretório do Apache Tomcat 8.5 e iniciar o servidor. O tomcar se encarrega de subir o app na URL http://localhost:8080/valburguer/ (atenção para a barra ao final)

Para importar o projeto no Eclipse, primeiramente clone a URL e depois, no Eclipse:
- Vá até o menu File > Import...
- Na janela que irá abrir, selecione a opção Existing Maven Projects
- Navegue até a pasta onde o projeto foi clonado (mais especificamente, aquela que contém o arquivo pom.xml)
- No campo Projects irá aparecer o arquivo pom.xml do projeto; selecione-o (caso já não esteja) e clique em Finish
- Aguarde enquanto o eclipse importa o projeta e o compila.

Para executar o projeto no Eclipse pela primeira vez, é preciso:
- Ter baixado o servidor [Apache Tomcat 8.5](https://tomcat.apache.org/download-80.cgi)
- Criar um servidor no Eclipse apontado para a pasta onde o arquivo do Tomcat foi descompactado
- Aplicar o arquivo <pasta do projeto>/db/datapack.sql na sua instância do mysql (este SQL irá criar o schema 'valburguer' e incluirá algumas linhas para teste)
- Criar um usuário para acessar o schema recém-criado (o usuário e a senha são configuráveis atavés do arquivod db.properties que existe no projeto; note que é lá também que a porta de acesso ao MySQL pode ser definida, caso não seja a 3306 padrão)

Agora, é só solicitar ao Eclipse que rode o projeto no servidor criado (botão direito no projeto > Run As > Run on Server) e acessar o site pela url localhost:8080/valburguer/ (altere a porta caso a configuração do seu servidor esteja diferente).

## Conclusão

Infelizmente não pude fazer tudo que queria neste app, pois acabei demorando mais do que imaginava nas características responsivas. Dado o atraso, o acabamento das telas ficou um pouco pobre em termos de design, embora não seja muito complicado, com tempo hábil, fazer alguns ajustes no CSS. Reconheço que avaliei mal a complexidade do projeto e que, numa próxima vez, devo considerar a possibilidade de utilizar um framework para poupar trabalho em alguns casos.

Enfim, foi uma experiência bastante cansativa, mas muito recompensante, pois aprendi algumas novidades sobre CSS responsivo e HTML semântico. No mais, pude colocar em prática meus conhecimentos em JAVA, gerando um produto que se aproxima muito de um aplicativo real, o que é bastante gratificante.
