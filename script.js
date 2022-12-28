//Variavel global modal
let modalKey = 0

//variavel para controlar quantidade de itens iniciais
let quantcoffes = 1

let cart = [] //carrinho

//funçoes uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}


const abrirModal = () => {
    seleciona('.coffeWindowArea').style.opacity = 0
    seleciona('.coffeWindowArea').style.display = 'flex'
    setTimeout(() => {seleciona('.coffeWindowArea').style.opacity = 1}, 150)
}
 const fecharModal = () => {
    seleciona('.coffeWindowArea').style.opacity = 0
    setTimeout(() => {seleciona('.coffeWindowArea').style.display = 'none'}, 500)
 }

 const botoesFechar = () => {
    //fechar modal
    selecionaTodos('.coffeInfo--cancelButton, .coffeInfo--cancelMobileButton').forEach((item) => {
        item.addEventListener('click', fecharModal)
    })
 }

 const preencherDadosCard = (coffeItem, item, index) => {
    coffeItem.setAttribute('data-key', index)
    coffeItem.querySelector('.coffe-item--img img').src = item.img
    coffeItem.querySelector('.coffe-item--price').innerHTML = formatoReal(item.price[2])
    coffeItem.querySelector('.coffe-item--name').innerHTML = item.name
    coffeItem.querySelector('.coffe-item--desc').innerHTML = item.description
 }

 const preenchedadosmodal = (item) => {
        /*document.querySelector('.coffeBig img').src = item.img
        document.querySelector('.coffeInfo h1').innerHTML = item.name
        document.querySelector('.coffeInfo--desc').innerHTML = item.description
        document.querySelector('.coffeInfo--actualPrice').innerHTML = `R$ ${item.price}`*/
        seleciona('.coffeBig img').src = item.img
        seleciona('.coffeInfo h1').innerHTML = item.name
        seleciona('.coffeInfo--desc').innerHTML = item.description
        seleciona('.coffeInfo--actualPrice').innerHTML = formatoReal(item.price[2])
 }
 const pegarKey = (e) => {
    //.closest retorna o elemento mais proximo que tem a class que passamos do
    //.coffe-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.coffe-item').getAttribute('data-key')
    console.log('Item clicado ' + key)
    console.log(coffeJson[key])

    //garantir que a quantidade inicial de itens sejam 1
    quantcoffes = 1

    // para manter a informação de qual item foi clicado
    modalKey = key

    return key
 }

 const preencherTamanhos = (key) => {
    // tira a seleção de tamanho atual e seleciona outro
    seleciona('.coffeInfo--size.selected').classList.remove('selected')

    //seleciona todos os tamanhos
    selecionaTodos('.coffeInfo--size').forEach((size, sizeIndex) => {
        //selecionar tamanho G
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = coffeJson[key].sizes[sizeIndex]

    })
 }

 const escolherTamanhoPreco = (key) => {
    //açoes nos button tamanho
    //selecionar todos os tamanhos
    selecionaTodos('.coffeInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            //clicou em um item, tirar a seleçao e marcar
            //tirar a seleção tamanho atual e marcar no grande
            seleciona('.coffeInfo--size.selected').classList.remove('selected')
            //marcar o que vc clicou, ao inves de usar e.target, usa o size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            //mudar o preco de acordo com o tamanho
            seleciona('.coffeInfo--actualPrice').innerHTML = formatoReal(coffeJson[key].price[sizeIndex])
        })
    })
 }
 
 const mudarQuantidade = () => {
    // Ações nos botoes + e - do modal
    seleciona('.coffeInfo--qtmais').addEventListener('click',() => {
        quantcoffes++
        seleciona('.coffeInfo--qt').innerHTML = quantcoffes
    })

    seleciona('.coffeInfo--qtmenos').addEventListener('click', () => {
        if(quantcoffes > 1){
            quantcoffes--
            seleciona('.coffeInfo--qt').innerHTML = quantcoffes
        }
    })
 }

 const adicionarNoCarrinho = () => {
    seleciona('.coffeInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar ao carrinho')

         // pegar dados da janela modal atual
         // qual item? pegue o modalKey para usar coffeJson[modalKey]
         console.log('Item ' + modalKey)
         // tamanho
         let size = seleciona('.coffeInfo--size.selected').getAttribute('data-key')
         console.log('tamanho ' + size)
         //quantidade
         console.log('Quant. ' + quantcoffes)
         // price
         let price = seleciona('.coffeInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')

         let identificador = coffeJson[modalKey].id+'t'+size

         let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantcoffes
        } else {
            // adicionar objeto cafe no carrinho
            let item = {
                identificador,
                id: coffeJson[modalKey].id,
                size, // size: size
                qt: quantcoffes,
                price: parseFloat(price) // price: price
            }
            cart.push(item)
            console.log(item)
            console.log('Sub total R$ ' + (item.qt * item.price).toFixed(2))
        }
        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
 }

 const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0){
        //mostra o carrinho
        seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    //exibir aside do carrinho no mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0){
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
 }

 const fecharCarrinho = () => {
    //fechar carrinho com botao x no mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' //ele fica fora da tela
        seleciona('header').style.display = 'flex'
    })
 }

 const atualizarCarrinho = () =>{
    // exibir numero de itens no carrinho
    seleciona('.menu-openner span').innerHTML = cart.length

    //mostrar ou nao o carrinho
    if(cart.length > 0){

        //mostrar  carrinho
        seleciona('aside').classList.add('show')

        //zerar meu .cart para nao fazer insercoes duplicadas
        seleciona('.cart').innerHTML = ''

        //crie as variaveis antes do for
        let subtotal = 0
        let desconto = 0
        let total = 0

        //para preencher os itens do carrinho, calcular subtotal

        for(let i in cart){
            //use o find para pegar o item por id
            let coffeItem = coffeJson.find( (item) => item.id == cart[i].id)
            console.log(coffeItem)

            //em cada item pegar o subtotal
            subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

            //fazer o clone, exibit na tela e depois preencher informações
            let cartItem = seleciona('.models .cart--item').cloneNode(true)
            seleciona('.cart').append(cartItem)
            
            let itemSizeName = cart[i].size

            let itemName = `${coffeItem.name} (${itemSizeName})`

            //preencher as informações
            cartItem.querySelector('img').src = coffeItem.img
            cartItem.querySelector('.cart--item-name').innerHTML = itemName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            

            //selecionar botoes + e -
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                console.log('clicou no botão mais')
                //adicionar apenas a quantidade que esta nesse contexto
                cart[i].qt++
                //atualizar qt
                atualizarCarrinho()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                console.log('clicou no botao menos')
                if(cart[i].qt > 1){
                    //subtrair apenas a quantidade que esta nesse contexto
                    cart[i].qt--
                }else {
                    //remover se for zero
                    cart.splice(i, 1)
                }

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''
                
                 //atualizar qt
                 atualizarCarrinho()
            })
            
            seleciona('.cart').append(cartItem)

        }//fim do for
        
        //desconto
        desconto = subtotal * 0
        total = subtotal - desconto

        //exibir na tela os resultados
        // selecionar o ultimo span do elemento
        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
        seleciona('.total span:last-child').innerHTML = formatoReal(total)

    } else{
        //ocultar carrinho
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
    }
 }

 const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
 }

coffeJson.map((item, index ) => {
    //console.log(item)
    let coffeItem = document.querySelector('.models .coffe-item').cloneNode(true)

    //console.log(coffeItem)

    //document.querySelector('.coffe-area').append(coffeItem)
    seleciona('.coffe-area').append(coffeItem)
    
    preencherDadosCard(coffeItem, item, index)

    //item clicado
    coffeItem.querySelector('.coffe-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou no item')

        let chave = pegarKey(e)

        //abre janela
        //document.querySelector('.coffeWindowArea').style.display = 'flex'
        abrirModal()

        //preencher dados
        preenchedadosmodal(item)

        //tamanho selecionado
        preencherTamanhos(chave)

        //definir quantidade inicial como 1
        seleciona('.coffeInfo--qt').innerHTML = quantcoffes

        escolherTamanhoPreco(chave)

        

    })

    document.querySelector('.coffeInfo--cancelButton').addEventListener('click', () =>{
        document.querySelector('.coffeWindowArea').style.display = 'none'
    })

    document.querySelector('.coffeInfo--cancelMobileButton').addEventListener('click', () =>{
        document.querySelector('.coffeWindowArea').style.display = 'none'
    })

    botoesFechar()
}) // fim do map coffeJson

//mudar quantidade com os botoes + e -
mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
