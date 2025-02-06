import path from 'path';
import fs from 'fs';
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');
import yaml from 'yaml';

const theme = new SwaggerTheme();
const darkStyle = theme.getBuffer(SwaggerThemeNameEnum.DRACULA);

class SwaggerConfigurationImpl {
  private getSwaggerDocument() {
    const rootDocument = fs.readFileSync(path.join(__dirname, '../../etc/api-documentation.yaml'), 'utf8');
    const root = yaml.parse(
      rootDocument
        .replace('${API_VERSION}', process.env.API_VERSION!)
        .replace('${API_URL}', process.env.API_URL!)
        .replace('${NODE_ENV}', process.env.NODE_ENV!),
    );
    const swaggerDocumentJSON: any = {
      ...root,
    };
    return swaggerDocumentJSON;
  }

  getSwaggerJSDoc() {
    return {
      definition: this.getSwaggerDocument(),
      apis:
        process.env.NODE_ENV === 'dev'
          ? [path.join(__dirname, '../../controller/**/*.ts'), path.join(__dirname, '../../provider/**/*.ts')]
          : [path.join(__dirname, '../../controller/**/*.js'), path.join(__dirname, '../../provider/**/*.js')],
    };
  }

  public styleOptions = {
    customCss: `
    ${darkStyle}
    .swagger-ui .topbar { display: none !important; }
    .json-schema-2020-12 { background-color: #282A35 !important; color: #fff !important; }
    .json-schema-2020-12__title { background-color: #282A35 !important; color: #fff !important; }
    .json-schema-2020-12-head { background-color: #282A35 !important; color: #fff !important; }
    .json-schema-2020-12-body { background-color: #282A35 !important; color: #fff !important; }
    .json-schema-2020-12-accordion { background-color: #282A35 !important; color: #fff !important; }
    .json-schema-2020-12-expand-deep-button { background-color: #282A35 !important; color: #fff !important; }
    .renderedMarkdown { color: #fff !important; }
  `,
    customSiteTitle: 'Dummy SMS API Documentation | Logicri',
    customfavIcon: '/favicon.ico',
  };
}

export const SwaggerConfiguration = new SwaggerConfigurationImpl();
