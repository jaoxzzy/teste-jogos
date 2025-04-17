<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $tempo = intval($_POST['tempo']);
  $data = date('Y-m-d H:i:s');
  
  $linha = "$data - Tempo: $tempo segundos\n";
  
  file_put_contents('pontuacoes.txt', $linha, FILE_APPEND);
  echo "Pontuação salva com sucesso!";
} else {
  echo "Requisição inválida.";
}
?>
