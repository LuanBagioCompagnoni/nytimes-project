<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!is_array($data) || empty($data)) {
        http_response_code(400);
        echo json_encode(['message' => 'Nenhum dado válido foi enviado.']);
        exit;
    }

    $query = "INSERT INTO articles (title, url, byline, published_date) 
              VALUES (:title, :url, :byline, :published_date)";
    $stmt = $pdo->prepare($query);

    $errors = [];
    $successCount = 0;

    foreach ($data['articles'] as $article) {
        if (!isset($article['title']) || empty($article['title']) ||
            !isset($article['url']) || empty($article['url']) ||
            !isset($article['published_date']) || empty($article['published_date'])) {
            $errors[] = "Artigo inválido: Campos obrigatórios ausentes ou vazios. Dados: " . json_encode($article);
            continue;
        }

        $byline = $article['byline'] ?? 'Unknown';

        try {
            $stmt->execute([
                ':title' => $article['title'],
                ':url' => $article['url'],
                ':byline' => $byline,
                ':published_date' => $article['published_date']
            ]);
            $successCount++;
        } catch (PDOException $e) {
            $errors[] = "Erro ao salvar o artigo: {$article['title']}. Mensagem: " . $e->getMessage();
        }
    }

    echo json_encode([
        'message' => "Todos os artigos foram salvos com sucesso!",
        'success' => $successCount,
        'errors' => $errors
    ]);
}

?>
