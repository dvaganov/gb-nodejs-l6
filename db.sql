CREATE TABLE todos (
    id Int( 255 ) UNSIGNED AUTO_INCREMENT NOT NULL,
    text VarChar( 255 ) NOT NULL,
    completed VarChar( 255 ) NOT NULL,
    CONSTRAINT unique_id UNIQUE( id ) )
ENGINE = InnoDB;
