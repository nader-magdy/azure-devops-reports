import { Injectable } from "@nestjs/common"
import { IAzureDevOpsConfig } from "src/configs/azure-devops-config";

@Injectable()
export class ConfigService{
    get azureDevOpsConfigs () : IAzureDevOpsConfig{
        return {
            token : process.env.AZURE_DEVOPS_TOKEN,
            organization : process.env.AZURE_DEVOPS_ORG,
            project : process.env.AZURE_DEVOPS_PROJECT,
            team : process.env.AZURE_DEVOPS_TEAM
        };
    }
}