<?php

require_once __DIR__ . '/Database.php';

class PlayerController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Agregar o actualizar un jugador
     * POST /api/players
     * Body: {id, name, avatar}
     */
    public function addPlayer() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id']) || !isset($data['name'])) {
                return $this->jsonResponse(['error' => 'Missing required fields: id, name'], 400);
            }

            $stmt = $this->db->prepare('
                INSERT INTO players (id, name, avatar, created_at)
                VALUES (:id, :name, :avatar, :created_at)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    avatar = EXCLUDED.avatar
            ');

            $stmt->execute([
                ':id' => $data['id'],
                ':name' => $data['name'],
                ':avatar' => $data['avatar'] ?? null,
                ':created_at' => intval(microtime(true) * 1000),
            ]);

            $this->logInsert($data['name']);

            return $this->jsonResponse(['success' => true, 'id' => $data['id']]);
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener todos los jugadores
     * GET /api/players
     */
    public function getPlayers() {
        try {
            $stmt = $this->db->prepare('
                SELECT id, name, avatar, created_at
                FROM players
                ORDER BY created_at DESC
            ');
            $stmt->execute();
            $players = $stmt->fetchAll();

            return $this->jsonResponse($players);
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener un jugador por ID
     * GET /api/players/{id}
     */
    public function getPlayer($id) {
        try {
            $stmt = $this->db->prepare('
                SELECT id, name, avatar, created_at
                FROM players
                WHERE id = :id
            ');
            $stmt->execute([':id' => $id]);
            $player = $stmt->fetch();

            if (!$player) {
                return $this->jsonResponse(['error' => 'Player not found'], 404);
            }

            return $this->jsonResponse($player);
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    private function logInsert(string $name): void {
        $reset = "\033[0m";
        $blue = "\033[38;5;33m"; // azul oscuro
        $cyan = "\033[36m";

        $date = date('Y-m-d H:i:s');
        $message = "{$blue}[{$date}]{$reset} {$cyan}[REGISTRO]{$reset} Usuario insertado: {$name}\n";
        file_put_contents('php://stderr', $message);
    }

}