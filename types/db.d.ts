interface IDBConfig {
  mysql: {
    url: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize?: boolean;
  };

  redis: {
    database: string;
    port: string;
    db: string;
  };
}
