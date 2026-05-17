<?php

class Database {
    private static ?PDO $instance = null;

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            self::$instance = new PDO(
                sprintf(
                    'pgsql:host=%s;dbname=%s',
                    $_ENV['DB_HOST'] ?? 'postgres',
                    $_ENV['DB_NAME'] ?? 'poke_guess'
                ),
                $_ENV['DB_USER'] ?? 'postgres',
                $_ENV['DB_PASS'] ?? 'postgres_password',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        }
        return self::$instance;
    }
}
