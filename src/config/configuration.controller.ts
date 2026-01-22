import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigurationService } from './configuration.service';

@ApiTags('configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @ApiOperation({ summary: 'Get public configuration' })
  @ApiResponse({ status: 200, description: 'Public configuration retrieved successfully' })
  getPublicConfiguration() {
    return {
      apiPrefix: this.configurationService.apiPrefix,
      blockchainNetwork: this.configurationService.blockchainNetwork,
      maxFileSize: this.configurationService.maxFileSize,
      allowedFileTypes: this.configurationService.allowedFileTypes,
      ipfsGatewayUrl: this.configurationService.ipfsGatewayUrl,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check configuration health' })
  @ApiResponse({ status: 200, description: 'Configuration is healthy' })
  getConfigurationHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: this.configurationService.nodeEnv,
      swaggerEnabled: this.configurationService.swaggerEnabled,
    };
  }
}
