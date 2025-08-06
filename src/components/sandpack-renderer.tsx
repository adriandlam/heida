import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFiles,
} from "@codesandbox/sandpack-react";

interface SandpackRendererProps {
  content: string;
  type: string;
  language?: string;
  dependencies?: Record<string, string>;
  viewMode: "artifact" | "code";
}

export function SandpackRenderer({
  content,
  type,
  language,
  dependencies = {},
  viewMode,
}: SandpackRendererProps) {
  // Determine template and files based on artifact type
  const getSandpackConfig = () => {
    switch (type) {
      case "application/vnd.ant.react": {
        // For React components, create a complete app structure
        const files: SandpackFiles = {
          "/App.js": {
            code: content,
          },
          "/index.js": {
            code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
          },
        };

        return {
          template: "react" as const,
          files,
          dependencies,
        };
      }

      case "text/html": {
        const files: SandpackFiles = {
          "/index.html": {
            code: content,
          },
        };

        return {
          template: "static" as const,
          files,
        };
      }

      case "application/vnd.ant.code": {
        if (language === "javascript" || language === "js") {
          const files: SandpackFiles = {
            "/index.js": {
              code: content,
            },
            "/index.html": {
              code: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Example</title>
</head>
<body>
    <div id="app"></div>
    <script src="./index.js"></script>
</body>
</html>`,
            },
          };

          return {
            template: "vanilla" as const,
            files,
          };
        }

        if (language === "typescript" || language === "ts") {
          const files: SandpackFiles = {
            "/index.ts": {
              code: content,
            },
          };

          return {
            template: "vanilla-ts" as const,
            files,
          };
        }

        if (language === "css") {
          const files: SandpackFiles = {
            "/styles.css": {
              code: content,
            },
            "/index.html": {
              code: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Example</title>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <div class="container">
        <h1>CSS Preview</h1>
        <p>Your CSS styles are applied to this page.</p>
    </div>
</body>
</html>`,
            },
          };

          return {
            template: "static" as const,
            files,
          };
        }

        // Default fallback for other code types
        const files: SandpackFiles = {
          "/index.js": {
            code: content,
          },
        };

        return {
          template: "vanilla" as const,
          files,
        };
      }

      default: {
        // Fallback for unknown types
        const files: SandpackFiles = {
          "/index.js": {
            code: content,
          },
        };

        return {
          template: "vanilla" as const,
          files,
        };
      }
    }
  };

  const {
    template,
    files,
    dependencies: configDependencies,
  } = getSandpackConfig();

  return (
    <div className="w-full h-full overflow-hidden">
      <SandpackProvider
        template={template}
        files={files}
        theme="auto"
        className="!h-full"
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          autorun: true,
          recompileMode: "immediate",
          recompileDelay: 500,
          bundlerURL: undefined, // Use default bundler
          activeFile: template === "react" ? "/App.js" : Object.keys(files)[0],
        }}
        customSetup={{
          dependencies: {
            ...configDependencies,
            // Common dependencies available for React artifacts
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "lucide-react": "^0.263.1",
            recharts: "^2.8.0",
            // Allow additional dependencies to be passed in
            ...dependencies,
          },
        }}
      >
        <SandpackLayout className="!h-full">
          {viewMode === "code" ? (
            <SandpackCodeEditor
              readOnly={true}
              showTabs={false}
              showLineNumbers={true}
              showInlineErrors={true}
              wrapContent={true}
              className="!h-full"
            />
          ) : (
            <SandpackPreview
              showRefreshButton={true}
              showOpenInCodeSandbox={false}
              className="!h-full"
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
