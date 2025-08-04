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
    type: 'single' | 'cluster';
    host: string;
    port: number;
    db: number;
  };
}
