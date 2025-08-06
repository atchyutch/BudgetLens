CREATE TABLE IF NOT EXISTS users (
  user_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_email      VARCHAR(100) NOT NULL UNIQUE,
  firstname      VARCHAR(50) NOT NULL,
  lastname       VARCHAR(50) NOT NULL,
  username       VARCHAR(50) NOT NULL UNIQUE,
  hashedpassword VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS accounts (
  item_id              VARCHAR(200)        PRIMARY KEY,             
  encrypted_access_token VARCHAR(512)   NOT NULL,                
  user_id              INT                NOT NULL,
  created_at           TIMESTAMP          DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budget_user
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS transactions(
  transaction_id    INT                 PRIMARY KEY,
  item_id           VARCHAR(200)        NOT NULL,
  transaction_date  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS budgets(
  budget_id           INT                 PRIMARY KEY AUTO_INCREMENT,
  user_id             INT                 NOT NULL,
  budget_amount       DECIMAL(10, 2)     NOT NULL,
  budget_name         VARCHAR(100)        NOT NULL,
  budget_category     VARCHAR(50)         NOT NULL,
  CONSTRAINT fk_accounts_user
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
)