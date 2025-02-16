let listaBase = [];//lista com todas as musicas, carregada direto da lista txt
let listaFavoritos=[];//lista usada para salvar temporariamente e atualizar os favoritos
let listaVisivel=[];//lista que troca seus valores dependnedo se estiver na home ou favoritos e é usada para os filtros, aleatórios e restauração
let listaCarregada=0;//0=home, 1=Favoritos

        // Função para carregar o arquivo de texto quando a página for carregada
        window.onload = function() {
            //carregar lista de favoritos
            listaFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            //carregar a lsita de musicas na tela
            fetch('lista.txt')
                .then(response => response.text())
                .then(text => {
                    listaBase = text
                    .split('\n') // Divide o texto em linhas
                    .map(line => line.trim()) // Remove espaços em branco ao redor de cada linha
                    .filter(line => line.length > 0); // Remove linhas vazias
                    listaVisivel=listaBase;
                    montarLista(listaVisivel);
                });
        };

        // Função para filtrar as músicas conforme a pesquisa do usuário
        function filtrarMusicas() {
            const query = document.getElementById('pesquisa').value.toLowerCase();
            const result = listaVisivel.filter(song => song.toLowerCase().includes(query));
            montarLista(result);
            
        }

        function montarLista(lista){
            let idIconeFavoritos=0;
            if(lista.length == 0){
                document.getElementById('lista').innerHTML = `<h2>Nenhuma música encontrada.</h2>`;
            }  else{
            document.getElementById('lista').innerHTML = lista.map(song => `<div class="caixaMusica">
                <button class="botaoFavoritos ${verificarNosFavoritos(song) ? 'botaoMusicaFavoritada' : ''}" onclick="clicarFavoritos('${song}', '${idIconeFavoritos}', this)"><img src="${verificarNosFavoritos(song) ? "imagens/setuniHeart.png" : "imagens/iconeCoracao.png"}" alt="iconeCoração" class="iconeFavoritos" id="${idIconeFavoritos++}"></button>
                <p>${song}</p>
                <button class="botaoCopiar" onclick="copiar('${song}')"><img src="imagens/iconeCopiar.png" alt="Copiar" class="iconeCopiar"></button>
                </div>`).join('');
            }
        }

        function musicaAleatoria(){
            let aleatorio=[];
    if (listaVisivel.length > 0) {
            aleatorio.push(listaVisivel[Math.floor(Math.random() * listaVisivel.length)]);
        }
            montarLista(aleatorio);
        }

        function restaurarLista() {
            montarLista(listaVisivel);
        }

        function copiar(musica) {
            navigator.clipboard.writeText(musica);
        }

        function clicarFavoritos(musica, idIconeFavoritos, botao) {
            if(verificarNosFavoritos(musica)){//remova da lista de favoritos
                removerFavorito(musica);
            } else{//adicione na lista de favoritos
                adicionarFavorito(musica);
            }
            atualizarIconeFavoritos(verificarNosFavoritos(musica), idIconeFavoritos);
            botao.classList.toggle("botaoMusicaFavoritada")
            
        }

        function verificarNosFavoritos(musica){
            for (const musicaFavorita of listaFavoritos) {
                if(musicaFavorita==musica){return true;}
            }
            return false;
        }

        function adicionarFavorito(musica) {
            listaFavoritos.push(musica);
            atualizarFavoritosStorage();
            atualizarTelaDeFavoritos();
            
        }

        function removerFavorito(musica) {
            listaFavoritos= listaFavoritos.filter(musicaFavorita=>musicaFavorita!=musica);
            atualizarFavoritosStorage();
            atualizarTelaDeFavoritos();
        }

        function atualizarFavoritosStorage() {
            localStorage.setItem('favoritos', JSON.stringify(listaFavoritos));
        }

        function atualizarIconeFavoritos(favorito, posicao) {
            let imagem= document.getElementById(posicao);
            if(favorito){
                imagem.src="imagens/setuniHeart.png";
            } else{
                imagem.src="imagens/iconeCoracao.png";
            }
        }

        function atualizarTelaDeFavoritos(){//serve apenas para atualizar a lista visivel quando estiver na tela de favoritos...
            if(listaCarregada==1){
                listaVisivel=listaFavoritos;
            }
        }

        function trocarTela() {//serve para trocar as listas visiveis entre a lista base (todas as musicas) e a lista de favoritos... os aleatórios e as pesquisas serão baseadas na lista que estiver visivel
            let titulo= document.getElementById("tituloFavoritos");
            let alerta= document.getElementById("alertaFavoritos");
            let iconeTrocaTela= document.getElementById("IconeHomeEFavoritos");
            if(listaCarregada==0){//caso esteja na home, vai para a favoritos
                listaCarregada=1;
                titulo.style.display="block";
                alerta.style.display="block";
                listaVisivel=listaFavoritos;
                iconeTrocaTela.src="imagens/iconeHome.png";
            }else{//caso esteja nos favoritos, vai para a home
                listaCarregada=0;
                titulo.style.display="none";
                alerta.style.display="none";
                listaVisivel=listaBase;
                iconeTrocaTela.src="imagens/iconeCoracao.png";
            }
            montarLista(listaVisivel);
        }