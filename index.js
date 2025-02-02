let listaBase = [];

        // Função para carregar o arquivo de texto quando a página for carregada
        window.onload = function() {
            fetch('lista.txt')
                .then(response => response.text())
                .then(text => {
                    listaBase = text
                    .split('\n') // Divide o texto em linhas
                    .map(line => line.trim()) // Remove espaços em branco ao redor de cada linha
                    .filter(line => line.length > 0); // Remove linhas vazias
                    montarLista(listaBase);
                });
        };

        // Função para filtrar as músicas conforme a pesquisa do usuário
        function filtrarMusicas() {
            const query = document.getElementById('pesquisa').value.toLowerCase();
            const result = listaBase.filter(song => song.toLowerCase().includes(query));
            montarLista(result);
            
        }

        function montarLista(lista){
            if(lista.lenght ===0){
                document.getElementById('lista').innerHTML = result.map(song => `<h2>Nenhuma música encontrada.</h2>`).join('');
            }  else{
            document.getElementById('lista').innerHTML = lista.map(song => `<p>${song}</p>`).join('');
            }
        }

        function musicaAleatoria(){
            let aleatorio=[];
            aleatorio.push(listaBase[Math.floor(Math.random() * listaBase.length)]);
            montarLista(aleatorio);
        }

        function restaurarLista() {
            montarLista(listaBase);
        }