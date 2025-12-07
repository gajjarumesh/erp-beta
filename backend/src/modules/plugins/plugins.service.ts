import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plugin, PluginConfig } from '../../database/entities';
import { CreatePluginDto, UpdatePluginDto, ConfigurePluginDto } from './dto/plugin.dto';

@Injectable()
export class PluginsService {
  private readonly logger = new Logger(PluginsService.name);

  constructor(
    @InjectRepository(Plugin)
    private pluginsRepository: Repository<Plugin>,
    @InjectRepository(PluginConfig)
    private pluginConfigsRepository: Repository<PluginConfig>,
  ) {}

  // Plugin Management (Admin)
  async createPlugin(createDto: CreatePluginDto): Promise<Plugin> {
    const plugin = this.pluginsRepository.create(createDto);
    return await this.pluginsRepository.save(plugin);
  }

  async findAllPlugins(): Promise<Plugin[]> {
    return await this.pluginsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findPluginByKey(key: string): Promise<Plugin> {
    const plugin = await this.pluginsRepository.findOne({
      where: { key },
    });

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    return plugin;
  }

  async updatePlugin(key: string, updateDto: UpdatePluginDto): Promise<Plugin> {
    const plugin = await this.findPluginByKey(key);
    
    Object.assign(plugin, updateDto);
    
    return await this.pluginsRepository.save(plugin);
  }

  async deletePlugin(key: string): Promise<void> {
    const plugin = await this.findPluginByKey(key);
    await this.pluginsRepository.remove(plugin);
  }

  // Plugin Configuration (Per Tenant)
  async getPluginsForTenant(tenantId: string): Promise<any[]> {
    const plugins = await this.pluginsRepository.find({
      where: { isEnabled: true },
      order: { name: 'ASC' },
    });

    const configs = await this.pluginConfigsRepository.find({
      where: { tenantId },
    });

    const configMap: Record<string, PluginConfig> = configs.reduce((acc, config) => {
      acc[config.pluginKey] = config;
      return acc;
    }, {} as Record<string, PluginConfig>);

    return plugins.map((plugin) => ({
      ...plugin,
      tenantConfig: configMap[plugin.key] || null,
    }));
  }

  async configurePlugin(
    tenantId: string,
    pluginKey: string,
    configDto: ConfigurePluginDto,
  ): Promise<PluginConfig> {
    // Verify plugin exists
    await this.findPluginByKey(pluginKey);

    // Find or create config
    let config = await this.pluginConfigsRepository.findOne({
      where: { tenantId, pluginKey },
    });

    if (config) {
      Object.assign(config, configDto);
    } else {
      config = this.pluginConfigsRepository.create({
        tenantId,
        pluginKey,
        ...configDto,
      });
    }

    return await this.pluginConfigsRepository.save(config);
  }

  async getPluginConfig(
    tenantId: string,
    pluginKey: string,
  ): Promise<PluginConfig | null> {
    return await this.pluginConfigsRepository.findOne({
      where: { tenantId, pluginKey },
      relations: ['plugin'],
    });
  }

  async togglePlugin(
    tenantId: string,
    pluginKey: string,
    isEnabled: boolean,
  ): Promise<PluginConfig> {
    let config = await this.pluginConfigsRepository.findOne({
      where: { tenantId, pluginKey },
    });

    if (config) {
      config.isEnabled = isEnabled;
    } else {
      config = this.pluginConfigsRepository.create({
        tenantId,
        pluginKey,
        config: {},
        isEnabled,
      });
    }

    return await this.pluginConfigsRepository.save(config);
  }

  async getEnabledPlugins(tenantId: string): Promise<Plugin[]> {
    const configs = await this.pluginConfigsRepository.find({
      where: { tenantId, isEnabled: true },
      relations: ['plugin'],
    });

    return configs.map((config) => config.plugin).filter((plugin) => plugin);
  }

  // Plugin Interface Methods
  // These would be implemented by actual plugin system
  
  async registerWorkflowAction(
    pluginKey: string,
    actionKey: string,
    handler: (params: any) => Promise<any>,
  ): Promise<void> {
    // Store workflow action registration
    this.logger.log(`Registered workflow action ${actionKey} for plugin ${pluginKey}`);
  }

  async registerPage(
    pluginKey: string,
    pageConfig: {
      path: string;
      title: string;
      component: string;
    },
  ): Promise<void> {
    // Store page registration for frontend
    this.logger.log(`Registered page ${pageConfig.path} for plugin ${pluginKey}`);
  }

  async registerWidget(
    pluginKey: string,
    widgetConfig: {
      key: string;
      title: string;
      component: string;
    },
  ): Promise<void> {
    // Store widget registration
    this.logger.log(`Registered widget ${widgetConfig.key} for plugin ${pluginKey}`);
  }
}
