export type File = {
  name: string;
  language: 'javascript' | 'python' | 'markdown' | 'json' | 'text';
  content: string;
};

export type Directory = {
  name: string;
  files: File[];
  directories: Directory[];
};

export const repository: Directory = {
  name: 'hexivium-demo-repo',
  directories: [
    {
      name: 'src',
      directories: [
        {
          name: 'components',
          directories: [],
          files: [
            {
              name: 'Button.jsx',
              language: 'javascript',
              content: `import React from 'react';

// A simple button component
const Button = ({ children, onClick, style }) => {
  const defaultStyle = {
    backgroundColor: '#673AB7',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <button onClick={onClick} style={{ ...defaultStyle, ...style }}>
      {children}
    </button>
  );
};

export default Button;
`,
            },
            {
              name: 'Header.jsx',
              language: 'javascript',
              content: `import React from 'react';

const Header = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
`,
            },
          ],
        },
        {
          name: 'services',
          directories: [],
          files: [
            {
              name: 'api.py',
              language: 'python',
              content: `import requests

class ApiClient:
    def __init__(self, base_url):
        self.base_url = base_url

    def get_data(self, endpoint):
        """Fetches data from a given endpoint."""
        try:
            response = requests.get(f"{self.base_url}/{endpoint}")
            response.raise_for_status()  # Raise an exception for bad status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None
`,
            },
          ],
        },
      ],
      files: [
        {
          name: 'App.jsx',
          language: 'javascript',
          content: `import React from 'react';
import Header from './components/Header';
import Button from './components/Button';

function App() {
  return (
    <div>
      <Header title="Welcome to Hexivium" />
      <Button onClick={() => alert('Button clicked!')}>
        Click Me
      </Button>
    </div>
  );
}

export default App;
`,
        },
      ],
    },
  ],
  files: [
    {
      name: 'README.md',
      language: 'markdown',
      content: `# Hexivium Demo Repository

This is a sample repository to demonstrate the capabilities of the Hexivium AI Code Browser.

## Features

- **File System Navigation**: Browse files and directories in the sidebar.
- **Syntax Highlighting**: View code with basic syntax highlighting.
- **AI-Powered Search**: Use the search bar to find code snippets with semantic search.

Try searching for "a button that shows an alert" or "a function that gets data from an API".
`,
    },
    {
      name: 'package.json',
      language: 'json',
      content: `{
  "name": "hexivium-demo",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "requests": "0.0.1-security"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
`,
    },
  ],
};
