<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/PlayerController.php';
require_once __DIR__ . '/ScoreController.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Router simple
$routes = [
    // Players
    'POST /players' => ['PlayerController', 'addPlayer'],
    'GET /players' => ['PlayerController', 'getPlayers'],
    'GET /players/([a-zA-Z0-9_-]+)' => ['PlayerController', 'getPlayer'],
    
    // Scores
    'POST /scores' => ['ScoreController', 'addScore'],
    'GET /scores/top/(\d+)' => ['ScoreController', 'getTopScores'],
    'GET /scores/top' => ['ScoreController', 'getTopScores'],
    'GET /scores/player/([a-zA-Z0-9_-]+)' => ['ScoreController', 'getPlayerScores'],
];

$matched = false;
foreach ($routes as $pattern => $action) {
    $parts = explode(' ', $pattern);
    $routeMethod = $parts[0];
    $routePath = $parts[1];
    
    if ($method !== $routeMethod) {
        continue;
    }
    
    // Convertir patrón de ruta a regex
    $regex = '/^' . str_replace('/', '\/', preg_replace('/\([^)]+\)/', '([^/]+)', $routePath)) . '$/';
    
    if (preg_match($regex, $path, $matches)) {
        array_shift($matches); // Remover el match completo
        
        try {
            $controller = new $action[0]();
            $method = $action[1];
            
            if (count($matches) > 0) {
                call_user_func_array([$controller, $method], $matches);
            } else {
                $controller->$method();
            }
            $matched = true;
            break;
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
            exit;
        }
    }
}

if (!$matched) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Route not found']);
}
