interface IDBConfig {
  mysql: {
    url: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };

  redis: {
    database: string;
    port: string;
    db: string;
  };
}