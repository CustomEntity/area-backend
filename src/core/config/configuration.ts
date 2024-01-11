/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  systemEpoch: parseInt(process.env.SYSTEM_EPOCH || '1609459200000', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  sessionSecret: process.env.SESSION_SECRET,
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || [],
    sasl: process.env.KAFKA_SASL_MECHANISM === 'true',
    ssl: process.env.KAFKA_SSL === 'true',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    groupId: process.env.KAFKA_GROUP_ID,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  oauth: {
    google: {
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
    },
    gmail: {
      clientId: process.env.OAUTH_GMAIL_CLIENT_ID,
      clientSecret: process.env.OAUTH_GMAIL_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GMAIL_CALLBACK_URL,
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_GITHUB_CALLBACK_URL,
    },
    spotify: {
      clientId: process.env.OAUTH_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.OAUTH_SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_SPOTIFY_CALLBACK_URL,
    },
  },
  application: {
    nytimes: {
      apiKey: process.env.APPLICATION_NYTIMES_API_KEY,
      secret: process.env.APPLICATION_NYTIMES_SECRET,
    },
    petfinder: {
      apiKey: process.env.APPLICATION_PETFINDER_API_KEY,
      secret: process.env.APPLICATION_PETFINDER_SECRET,
    },
  },
  instance: {
    datacenterId: parseInt(process.env.INSTANCE_DATACENTER_ID || '0', 10),
    workerId: parseInt(process.env.INSTANCE_WORKER_ID || '0', 10),
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
