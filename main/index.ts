import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../src/main.azure';


function createResponseHeaderIncludedApp(createApp: () => Promise<any>): () => Promise<any> {
  return async (): Promise<any> => {
    const app = await createApp();
    const responseHeaderIncludedApp = {
      getHttpAdapter: () => {
        return {
          getInstance: () => {
            return (req: any, res: any) => {
              const done = req.context.done;
              req.context.done = (err?: string | Error, result?: any) => {
                res.writeHead();
                done(err, result);
              };
              app.getHttpAdapter().getInstance()(req, res);
            };
          },
        };
      },
    };
    return responseHeaderIncludedApp;
  };
}


export default function(context: Context, req: HttpRequest): void {
  AzureHttpAdapter.handle(createResponseHeaderIncludedApp(createApp), context, req);
}
