import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  // Application
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get host(): string {
    return this.configService.get<string>('HOST');
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX');
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN');
  }

  get swaggerEnabled(): boolean {
    return this.configService.get<boolean>('SWAGGER_ENABLED');
  }

  // Database
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  // Redis
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  get redisPassword(): string | undefined {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  get redisDb(): number {
    return this.configService.get<number>('REDIS_DB');
  }

  // JWT
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
  }

  // API Keys
  get apiKey(): string | undefined {
    return this.configService.get<string>('API_KEY');
  }

  get encryptionKey(): string {
    return this.configService.get<string>('ENCRYPTION_KEY');
  }

  // Blockchain/Web3
  get blockchainNetwork(): string {
    return this.configService.get<string>('BLOCKCHAIN_NETWORK');
  }

  get rpcUrl(): string {
    return this.configService.get<string>('RPC_URL');
  }

  get privateKey(): string | undefined {
    return this.configService.get<string>('PRIVATE_KEY');
  }

  get etherscanApiKey(): string | undefined {
    return this.configService.get<string>('ETHERSCAN_API_KEY');
  }

  get web3StorageToken(): string | undefined {
    return this.configService.get<string>('WEB3_STORAGE_TOKEN');
  }

  // IPFS
  get ipfsGatewayUrl(): string {
    return this.configService.get<string>('IPFS_GATEWAY_URL');
  }

  get ipfsApiUrl(): string {
    return this.configService.get<string>('IPFS_API_URL');
  }

  get ipfsProjectId(): string | undefined {
    return this.configService.get<string>('IPFS_PROJECT_ID');
  }

  get ipfsProjectSecret(): string | undefined {
    return this.configService.get<string>('IPFS_PROJECT_SECRET');
  }

  // Rate Limiting
  get throttleTtl(): number {
    return this.configService.get<number>('THROTTLE_TTL');
  }

  get throttleLimit(): number {
    return this.configService.get<number>('THROTTLE_LIMIT');
  }

  // File Upload
  get maxFileSize(): number {
    return this.configService.get<number>('MAX_FILE_SIZE');
  }

  get allowedFileTypes(): string[] {
    return this.configService.get<string[]>('ALLOWED_FILE_TYPES');
  }

  // Email
  get smtpHost(): string | undefined {
    return this.configService.get<string>('SMTP_HOST');
  }

  get smtpPort(): number {
    return this.configService.get<number>('SMTP_PORT');
  }

  get smtpUser(): string | undefined {
    return this.configService.get<string>('SMTP_USER');
  }

  get smtpPass(): string | undefined {
    return this.configService.get<string>('SMTP_PASS');
  }

  get emailFrom(): string {
    return this.configService.get<string>('EMAIL_FROM');
  }

  // Monitoring
  get sentryDsn(): string | undefined {
    return this.configService.get<string>('SENTRY_DSN');
  }

  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL');
  }

  // External Services
  get coingeckoApiKey(): string | undefined {
    return this.configService.get<string>('COINGECKO_API_KEY');
  }

  get openseaApiKey(): string | undefined {
    return this.configService.get<string>('OPENSEA_API_KEY');
  }

  // Smart Contracts
  get propertyNftAddress(): string | undefined {
    return this.configService.get<string>('PROPERTY_NFT_ADDRESS');
  }

  get escrowContractAddress(): string | undefined {
    return this.configService.get<string>('ESCROW_CONTRACT_ADDRESS');
  }

  get governanceContractAddress(): string | undefined {
    return this.configService.get<string>('GOVERNANCE_CONTRACT_ADDRESS');
  }

  // Security
  get bcryptRounds(): number {
    return this.configService.get<number>('BCRYPT_ROUNDS');
  }

  get sessionSecret(): string {
    return this.configService.get<string>('SESSION_SECRET');
  }

  // Development
  get mockBlockchain(): boolean {
    return this.configService.get<boolean>('MOCK_BLOCKCHAIN');
  }

  get enableSeedData(): boolean {
    return this.configService.get<boolean>('ENABLE_SEED_DATA');
  }

  // Helper method to check if we're in development
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // Helper method to check if we're in production
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Helper method to check if we're in test
  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
}
