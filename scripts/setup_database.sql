CREATE TABLE IF NOT EXISTS users
(
    id                  bigint       NOT NULL,
    first_name          varchar(255) NULL,
    last_name           varchar(255) NULL,
    email               varchar(255) NOT NULL,
    hashed_password     varchar(255) NULL,
    profile_picture_url text,
    created_at          timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS applications
(
    id                        bigint       NOT NULL,
    name                      varchar(255) NOT NULL,
    icon_url                  text         NOT NULL,
    authentication_type       varchar(255) NOT NULL,
    authentication_parameters jsonb,
    authentication_secrets    jsonb,
    created_at                timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_connections
(
    id                     bigint    NOT NULL,
    user_id                bigint    NOT NULL,
    application_id         bigint    NOT NULL,
    name        varchar(255) NOT NULL,
    connection_credentials jsonb,
    created_at             timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (application_id) REFERENCES applications (id)
);

CREATE TABLE IF NOT EXISTS application_events
(
    id                      bigint       NOT NULL,
    application_id          bigint       NOT NULL,
    name                    varchar(255) NOT NULL,
    description             text         NOT NULL,
    notification_method     varchar(255) NOT NULL,
    notification_parameters jsonb,
    triggers                jsonb,
    created_at              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (application_id) REFERENCES applications (id),
    UNIQUE (application_id, name)
);

CREATE TABLE IF NOT EXISTS application_reactions
(
    id                   bigint       NOT NULL,
    application_event_id bigint       NOT NULL,
    name                 varchar(255) NOT NULL,
    description          text         NOT NULL,
    parameters           jsonb,
    created_at           timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (application_event_id) REFERENCES application_events (id),
    UNIQUE (application_event_id, name)
);