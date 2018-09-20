var alfabeto = "abcdefghijklmnopqrstuvwxyz";
var fullAlfabeto = alfabeto + alfabeto + alfabeto;

/*Função para criptografar utilizando substituicao*/
function cifraSubstituicao(texto, chave){
    chave = (chave % alfabeto.length);
    var resultado = '';

    for(i=0; i<texto.length; i++){
        var letter = texto[i];
        var upper = (letter == letter.toUpperCase());
        letter = letter.toLowerCase();

        var index = alfabeto.indexOf(letter);
        if(index == -1){
            resultado += letter;
        } else {
            index = ((index + chave) + alfabeto.length);
            var nextLetter = fullAlfabeto[index];
            if(upper) nextLetter = nextLetter.toUpperCase();
            resultado += nextLetter;
        }
    }

    $('#txt_result').val(resultado);
}

/*Funções para criptografar utilizando transposição*/
function cifraTransposicao(texto, chave, tipo) {
    var resultado = '';

    if(tipo == 0)
        resultado = transposicaoEncrypt(texto, chave);
    else
        resultado = transposicaoDecrypt(texto, chave);

    $('#txt_result').val(resultado);
}

function transposicaoEncrypt(texto, chave) {
    var klen = chave.length;

    var colLength = texto.length / klen;

    var resultado = "";
    k = 0;
    for (i = 0; i < klen; i++) {
        while (k < 26) {
            t = chave.indexOf(alfabeto.charAt(k));
            arrkw = chave.split("");
            arrkw[t] = "_";
            chave = arrkw.join("");
            if (t >= 0) break;
            else k++;
        }
        for (j = 0; j < colLength; j++) {
            resultado += texto.charAt(j * klen + t);
        }
    }
    return resultado;
}

function transposicaoDecrypt(texto, chave) {
    var klen = chave.length;
    if (klen <= 1) {
        alert("A chave deve ter pelo menos dois caracteres");
        return;
    }
    if (texto.length % klen != 0) {
        alert("O texto cifrado não foi preenchido, o resultado pode estar incorreto (chave incorreta?).");
    }

    // Primeiro colocamos o texto em colunas com base no tamanho da chave
    var cols = new Array(klen);
    var colLength = texto.length / klen;
    for (i = 0; i < klen; i++) cols[i] = texto.substr(i * colLength, colLength);

    // Agora, reorganizamos as colunas para que elas fiquem no estado de desembaralhamento
    var newcols = new Array(klen);
    j = 0;
    i = 0;
    while (j < klen) {
        t = chave.indexOf(alfabeto.charAt(i));
        if (t >= 0) {
            newcols[t] = cols[j++];
            arrkw = chave.split("");
            arrkw[t] = "_";
            chave = arrkw.join("");
        } else i++;
    }

    // Agora leia as colunas em linha
    var resultado = "";
    for (i = 0; i < colLength; i++) {
        for (j = 0; j < klen; j++) {
            resultado += newcols[j].charAt(i);
        }
    }
    return resultado;
}

function minusculo(value) {
    return value.toLowerCase().replace(/[^a-z]/g, "");
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

$(document).ready(function() {
    $('#btn_encript').click(function(){
        var texto = minusculo($("#txt_encript").val());
        var chave = $("#txt_key_encript").val();

        if($("input[name='algoritmo']:checked").val() == 0) {
            if(isNumber(chave))
                cifraSubstituicao(texto, chave);
            else
                alert("A chave precisa ser um número para o algoritmo de substituição!");
        }
        else {
            cifraTransposicao(texto, minusculo(chave), 0);
        }
    });

    $('#btn_decript').click(function(){
        var texto = minusculo($("#txt_decript").val());
        var chave = $("#txt_key_decript").val();

        if($("input[name='algoritmo']:checked").val() == 0) {
            if(isNumber(chave))
                cifraSubstituicao(texto, (chave * -1));
            else
                alert("A chave precisa ser um número para o algoritmo de substituição!");
        }
        else {
            cifraTransposicao(texto, minusculo(chave), 1);
        }
    });
});