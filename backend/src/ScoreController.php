<?php

require_once __DIR__ . '/Database.php';

class ScoreController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Agregar una puntuación
     * POST /api/scores
     * Body: {id, player_id, correct, total_time_ms, score}
     */
    public function addScore() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id']) || !isset($data['player_id']) || !isset($data['correct'])) {
                return $this->jsonResponse(['error' => 'Missing required fields'], 400);
            }

            // Verificar que el jugador existe
            $playerStmt = $this->db->prepare('SELECT id FROM players WHERE id = :player_id');
            $playerStmt->execute([':player_id' => $data['player_id']]);
            if (!$playerStmt->fetch()) {
                return $this->jsonResponse(['error' => 'Player not found'], 404);
            }

            $stmt = $this->db->prepare('
                INSERT INTO scores (id, player_id, correct, total_time_ms, score, date)
                VALUES (:id, :player_id, :correct, :total_time_ms, :score, :date)
            ');

            $stmt->execute([
                ':id' => $data['id'],
                ':player_id' => $data['player_id'],
                ':correct' => intval($data['correct']),
                ':total_time_ms' => intval($data['total_time_ms'] ?? 0),
                ':score' => intval($data['score'] ?? 0),
                ':date' => intval(microtime(true) * 1000),
            ]);

            // Obtener nombre del jugador para el log
            $playerStmt = $this->db->prepare('SELECT name FROM players WHERE id = :id');
            $playerStmt->execute([':id' => $data['player_id']]);
            $player = $playerStmt->fetch();

            $this->logScore($player['name'] ?? $data['player_id'], intval($data['score']));

            return $this->jsonResponse(['success' => true, 'id' => $data['id']]);
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener las mejores puntuaciones
     * GET /api/scores/top/{limit}?period=week|month|all
     */
    public function getTopScores($limit = 20) {
        try {
            $limit = intval($limit);
            if ($limit <= 0 || $limit > 100) {
                $limit = 20;
            }

            $period = $_GET['period'] ?? 'all';
            $whereClause = $this->getPeriodFilter($period);

            $stmt = $this->db->prepare("
                SELECT
                    s.id,
                    s.player_id,
                    p.name,
                    p.avatar,
                    s.correct,
                    s.total_time_ms,
                    s.score,
                    s.date
                FROM scores s
                LEFT JOIN players p ON p.id = s.player_id
                WHERE $whereClause
                ORDER BY s.correct DESC, s.total_time_ms ASC
                LIMIT :limit
            ");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            $scores = $stmt->fetchAll();

            return $this->jsonResponse($scores);
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener puntuaciones de un jugador
     * GET /api/scores/player/{player_id}?period=week|month|all
     */
    public function getPlayerScores($playerId) {
        try {
            $period = $_GET['period'] ?? 'all';
            $whereClause = $this->getPeriodFilter($period);

            $stmt = $this->db->prepare("
                SELECT
                    s.id,
                    s.player_id,
                    p.name,
                    p.avatar,
                    s.correct,
                    s.total_time_ms,
                    s.score,
                    s.date
                FROM scores s
                LEFT JOIN players p ON p.id = s.player_id
                WHERE s.player_id = :player_id
                AND $whereClause
                ORDER BY s.date DESC
            ");
            $stmt->execute([':player_id' => $playerId]);
            $scores = $stmt->fetchAll();

            return $this->jsonResponse($scores);
        } catch (Exception $e) {
            return $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generar filtro de periodo
     * @param string $period 'week' | 'month' | 'all'
     * @return string clause SQL para el WHERE
     */
    private function getPeriodFilter(string $period): string {
        $now = intval(microtime(true) * 1000);

        return match($period) {
            'week'  => "s.date >= " . ($now - 7 * 24 * 60 * 60 * 1000),
            'month' => "s.date >= " . ($now - 30 * 24 * 60 * 60 * 1000),
            default => "1=1"
        };
    }

    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    private function logScore(string $name, int $score): void {
        $reset = "\033[0m";
        $blue = "\033[38;5;33m"; // azul oscuro
        $cyan = "\033[36m";

        $date = date('Y-m-d H:i:s');
        $message = "{$blue}[{$date}]{$reset} {$cyan}[REGISTRO]{$reset} Usuario: {$name} | Puntaje insertado: {$score}\n";
        file_put_contents('php://stderr', $message);
    }
}
