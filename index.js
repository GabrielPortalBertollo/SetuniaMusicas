let listaBase = [];//lista com todas as musicas, carregada direto da lista txt
let listaFavoritos=[];//lista usada para salvar temporariamente e atualizar os favoritos
let listaVisivel=[];//lista que troca seus valores dependnedo se estiver na home ou favoritos e é usada para os filtros, aleatórios e restauração
let listaCarregada=0;//0=home, 1=Favoritos
let listaNovidades=[];

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
                    verificarSeTemMusicasNovasNaListaAtualizada();
                    atualizarListaDeNovidades();
                });
        };

        // Função para filtrar as músicas conforme a pesquisa do usuário
        function filtrarMusicas() {
            ocultarOuVisualizarNovidades();
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
                <button class="botaoFavoritos ${verificarNosFavoritos(song) ? 'botaoMusicaFavoritada' : ''}" onclick="clicarFavoritos('${song}', '${idIconeFavoritos}', this)"><img src="${verificarNosFavoritos(song) ? "assets/imagens/setuniHeart.png" : "assets/imagens/iconeCoracao.png"}" alt="iconeCoração" class="iconeFavoritos" id="${idIconeFavoritos++}"></button>
                <p>${song}</p>
                <button class="botaoCopiar" onclick="copiar('${song}')"><img src="assets/imagens/iconeCopiar.png" alt="Copiar" class="iconeCopiar"></button>
                </div>`).join('');
            }
        }

        function musicaAleatoria(){
            const caixaNovidades = document.getElementById('caixaNovidades');
            caixaNovidades.style.display="none";
            let aleatorio=[];
    if (listaVisivel.length > 0) {
            aleatorio.push(listaVisivel[Math.floor(Math.random() * listaVisivel.length)]);
        }
            montarLista(aleatorio);
        }

        function restaurarLista() {
            const query = document.getElementById('pesquisa')
            query.value="";
            montarLista(listaVisivel);
            ocultarOuVisualizarNovidades();
        }

        function copiar(musica) {
            navigator.clipboard.writeText(musica);
        }

        function clicarFavoritos(musica, idIconeFavoritos, botao) {
            if(verificarNosFavoritos(musica)){//remova da lista de favoritos
                removerFavorito(musica);
                let audio= new Audio("assets/audios/reverse_coin.mp3");
                audio.play();
            } else{//adicione na lista de favoritos
                adicionarFavorito(musica);
                let audio= new Audio("assets/audios/coin-collect-retro-8-bit-sound-effect-145251.mp3");
                audio.play();
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
                imagem.src="assets/imagens/setuniHeart.png";
            } else{
                imagem.src="assets/imagens/iconeCoracao.png";
            }
        }

        function atualizarTelaDeFavoritos(){//serve apenas para atualizar a lista visivel quando estiver na tela de favoritos...
            if(listaCarregada==1){
                listaVisivel=listaFavoritos;
            }
        }

        function trocarTela() {//serve para trocar as listas visiveis entre a lista base (todas as musicas) e a lista de favoritos... os aleatórios e as pesquisas serão baseadas na lista que estiver visivel
            let titulo= document.getElementById("titulo");
            let alerta= document.getElementById("alertaFavoritos");
            let iconeTrocaTela= document.getElementById("IconeHomeEFavoritos");
            if(listaCarregada==0){//caso esteja na home, vai para a favoritos
                listaCarregada=1;
                titulo.textContent="Favoritos";
                alerta.style.display="block";
                listaVisivel=listaFavoritos;
                iconeTrocaTela.src="assets/imagens/iconeHome.png";
            }else{//caso esteja nos favoritos, vai para a home
                listaCarregada=0;
                titulo.textContent="Principal";
                alerta.style.display="none";
                listaVisivel=listaBase;
                iconeTrocaTela.src="assets/imagens/iconeCoracao.png";
            }
            ocultarOuVisualizarNovidades();
            montarLista(listaVisivel);
        }

        function montarListaNovidades(){
            if(listaCarregada==0){

            }
        }

        function ocultarOuVisualizarNovidades(){//habilita ou desabilita a visualização da lista de novidades
            if(listaNovidades.length>0){
            if(listaCarregada==0){
                const query = document.getElementById('pesquisa').value;
                const caixaNovidades = document.getElementById('caixaNovidades');
                if(query.length==0){
                    caixaNovidades.style.display="block";
                }else{
                    caixaNovidades.style.display="none";
                }
            }else{
                caixaNovidades.style.display="none";
            }
        }
        }

        function verificarSeTemMusicasNovasNaListaAtualizada() {//utiliza a lista de musicas em localStorage e compara com a lista mais recente para identificar quais musicas são novas
            let listaMusicasAntigas = JSON.parse(localStorage.getItem('musicas')) || [];
            if(listaMusicasAntigas.length>0){
                let listaMusicasAntigasFormatadas= removerDataDasMusicasSalvas(listaMusicasAntigas);
                let musicasNovasAtualizadas=listaBase.filter(nomeNovaMusica=>//aqui é onde será filtrado e salvo apenas as musicas novas se tiver
                    !listaMusicasAntigasFormatadas.some(itemSalvo=>itemSalvo===nomeNovaMusica)
                );
                if(musicasNovasAtualizadas.length==0){return;}
                atualizarListaTodasAsMusicasStorage(musicasNovasAtualizadas);
            }
            else{criarStorageTodasAsMusicas()}
            
        }

        function atualizarListaTodasAsMusicasStorage(listaMusicasNovasParaAtualizar){//atualiza o local Storage com a lista que contenha todas as musicas, será usado de base no futuro para verificar quais musicas são novas
            let listaDeMusicasSalvas = JSON.parse(localStorage.getItem('musicas')) || [];//pega a lista das musicas ja salvas no locaStorage ja formatadas com suas respectivas datas

            let dataHoje= new Date();//pega a data de hoje
            dataHoje=dataHoje.toLocaleDateString("pt-BR");//formato ela para dia/mes/ano

            let listaDeNovidadesFormatada= listaMusicasNovasParaAtualizar.map(musica=>`${dataHoje}-${musica}`);//formata as musicas novas com a data de hoje

            let listaDefinitiva=[...listaDeMusicasSalvas, ...listaDeNovidadesFormatada];//junta tudo

            localStorage.setItem('musicas', JSON.stringify(listaDefinitiva));//salva no localStorage
        }

        function criarStorageTodasAsMusicas(){
            let dataAlterada= new Date();//pega a data de hoje e depois vai processando até que tenha um string da data de anteontem
            dataAlterada.setDate(dataAlterada.getDate() - 2);
            dataAlterada=dataAlterada.toLocaleDateString("pt-BR");//fim da formatação da data
            const listaAtualizadaComData = listaBase.map(musica => `${dataAlterada}-${musica}`);
            localStorage.setItem('musicas', JSON.stringify(listaAtualizadaComData));
        }

        function removerDataDasMusicasSalvas(listaParaFormatar){
            let listaFormatada= listaParaFormatar.map(musica=>{
                const [dataDescartavel, ...nomeMusicaArray] = musica.split("-");//separa toda a String pelos - sendo que o primeiro vai sempre para a variavel data e todos os outros para o nomeMusicaArray em formato de array ainda por conter varios dados
                const nomeMusica = nomeMusicaArray.join("-"); // Reconstrói o nome caso tenha " - " nele
                return nomeMusica;//salva no array da listaMusicasAntigasFormatadas o nome da musica sem a data
            });
            return listaFormatada;
        }

        function separarDataDasMusicasSalvas(listaParaFormatar){
            let listaFormatada= listaParaFormatar.map(musica=>{
                const [data, ...nomeMusicaArray] = musica.split("-");//separa toda a String pelos - sendo que o primeiro vai sempre para a variavel data e todos os outros para o nomeMusicaArray em formato de array ainda por conter varios dados
                const nomeMusica = nomeMusicaArray.join("-"); // Reconstrói o nome caso tenha " - " nele
                return {data,nomeMusica};//salva no array da listaMusicasAntigasFormatadas o nome da musica sem a data
            });
            return listaFormatada;
        }

        function atualizarListaDeNovidades(){
            let listaDeMusicasSalvas = JSON.parse(localStorage.getItem('musicas')) || [];//pega a lista das musicas ja salvas no locaStorage ja formatadas com suas respectivas datas
            let listaDeMusicasEData=separarDataDasMusicasSalvas(listaDeMusicasSalvas);
            let dataAtual = new Date(); // Data de hoje
            // Filtra músicas postadas nos últimos 2 dias
            listaNovidades = listaDeMusicasEData.filter(item => {
            let dataMusica = new Date(item.data.split('/').reverse().join('-')); // Converte data dd/mm/yyyy para formato Date(yyyy-mm-dd)
            let diferencaDias = (dataAtual - dataMusica) / (1000 * 60 * 60 * 24); // Diferença em dias(o resultado é em milissegundos, as multiplicações da divisão é para converter em dias(1000 é para milissegundo em segundo, 60 é para segundo em minuto, 60 é para minuto em hora e 24 é para hora em dias))
            return diferencaDias <= 2 && diferencaDias >= 0; // No máximo 2 dias atrás e desconsidera possiveis bugs de dias no futuro
            }).map(item => item.nomeMusica); // Pega apenas os nomes das músicas
            
            if(listaNovidades.length>0){montarListaDeNovidades();}

            ocultarOuVisualizarNovidades();
        }

        function montarListaDeNovidades(){
            let container= document.getElementById('caixaNovidades');
            container.innerHTML=`
            <h1 id="tituloNovidades" class="centralizarTextos">Novidades</h1>
            <div id="listaNovidades">
            ${listaNovidades.map(musica=>`
                <div class="caixaMusicaNovas">
                <p>${musica}</p>
                <button class="botaoCopiar" onclick="copiar('${musica}')">
                <img src="assets/imagens/iconeCopiar.png" alt="Copiar" class="iconeCopiar">
                </button>
                </div>`).join('')}
                </div>`;
        }

