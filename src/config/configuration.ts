import { ConfigLoader } from './config.loader';
import { JoiSchemaConfig } from './interfaces/joi-schema-config.interface';

// Export the validated configuration using our new loader
export default () => {
  return ConfigLoader.load();
};
