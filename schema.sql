CREATE TABLE auth_user (
    id text NOT NULL,
    username text,
    password_hash text,
    name text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE oauth_account (
    provider_id text NOT NULL,
    provider_user_id text NOT NULL,
    user_id text NOT NULL,
    PRIMARY KEY (provider_id, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE user_session (
    id text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    user_id text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE fraud_detection (
    transaction_id text NOT NULL,
    transaction_date timestamp with time zone,
    transaction_amount numeric(15,2),
    transaction_channel text,
    transaction_payment_mode text,
    payment_gateway_bank text,
    payer_email text,
    payer_mobile text,
    payer_card_brand text,
    payer_device text,
    payer_browser text,
    payee_id text,
    is_fraud_predicted boolean NOT NULL,
    fraud_source text,
    fraud_reason text,
    fraud_score float,
    user_id text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE fraud_reporting (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id text NOT NULL,
    reporting_entity_id text NOT NULL,
    fraud_details text,
    is_fraud_reported boolean DEFAULT TRUE,
    reporting_acknowledged boolean,
    failure_code integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_id text,
    PRIMARY KEY (id),
    FOREIGN KEY (transaction_id) REFERENCES fraud_detection(transaction_id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_token TEXT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    auth_user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auth_user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE INDEX idx_fraud_detection_transaction_id ON fraud_detection(transaction_id);
CREATE INDEX idx_fraud_reporting_transaction_id ON fraud_reporting(transaction_id);
CREATE INDEX idx_fraud_detection_transaction_date ON fraud_detection(transaction_date);
CREATE INDEX idx_fraud_detection_payer_email ON fraud_detection(payer_email);
CREATE INDEX idx_fraud_detection_payer_mobile ON fraud_detection(payer_mobile);
CREATE INDEX idx_fraud_detection_payee_id ON fraud_detection(payee_id);