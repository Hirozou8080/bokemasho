# password_reset_tokens ÆüÖë

## ÆüÖë
password_reset_tokens

## ¬
Ñ¹ïüÉê»ÃÈ(nÈü¯ó’¡Y‹ÆüÖë

## «éàš©

| i | Ö | ‹ | ­ü | ÇÕ©ëÈ | NULL | ¬ |
|--------|--------|-----|------|-----------|------|------|
| email | áüë¢Éì¹ | VARCHAR(255) | PRIMARY KEY | | NOT NULL | Ñ¹ïüÉê»ÃÈşanáüë¢Éì¹ |
| token | Èü¯ó | VARCHAR | | | NOT NULL | Ñ¹ïüÉê»ÃÈ(Èü¯ó |
| created_at | \åB | TIMESTAMP | | | NULL | Èü¯ó\åB |

## ¤óÇÃ¯¹
- email (PRIMARY KEY)

## êìü·çó

```mermaid
erDiagram
    users ||--o| password_reset_tokens : "Ñ¹ïüÉê»ÃÈ"

    password_reset_tokens {
        varchar email PK "áüë¢Éì¹"
        varchar token "Èü¯ó"
        timestamp created_at "\åB"
    }
```
