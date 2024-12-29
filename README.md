
# MakerDAO Automation

**Version:** 1.0.0  
**Description:** Automation tool for MakerDAO jobs using TypeScript and Viem.

---

## **Table of Contents**

1. [Requirements](#requirements)
2. [Dependencies](#dependencies)
3. [Installation Steps](#installation-steps)
4. [Execution](#execution)
5. [Development Tools](#development-tools)
6. [Docker Setup (Optional)](#docker-setup-optional)

---

## **Requirements**

To run this project, ensure your system meets the following requirements:

- **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Comes with Node.js installation.
- **Git**: Version control system ([Download Git](https://git-scm.com/))
- **TypeScript**: Installed as part of the project dependencies.
- **Docker** (Optional): For containerized deployment ([Download Docker](https://www.docker.com/))

---

## **Dependencies**

### **Runtime Dependencies**
These dependencies are required to run the project:
- **[axios](https://www.npmjs.com/package/axios)**: HTTP client for making API calls.
- **[discord.js](https://www.npmjs.com/package/discord.js)**: Library for interacting with Discord.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file.
- **[viem](https://www.npmjs.com/package/viem)**: Blockchain client for Ethereum-based networks.

### **Development Dependencies**
These tools are used during development and testing:
- **[@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)**: Linting for TypeScript.
- **[@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser)**: Parser for ESLint to support TypeScript.
- **[eslint](https://www.npmjs.com/package/eslint)**: Code linting tool.
- **[jest](https://www.npmjs.com/package/jest)**: Testing framework.
- **[prettier](https://www.npmjs.com/package/prettier)**: Code formatting tool.
- **[ts-node](https://www.npmjs.com/package/ts-node)**: Run TypeScript directly without precompilation.
- **[typescript](https://www.npmjs.com/package/typescript)**: TypeScript compiler.

---

## **Installation Steps**

Follow these steps to set up the project on a new system:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-repository>/makerdao-automation.git
   cd makerdao-automation
   ```

2. **Install Dependencies**
   Install all project dependencies:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the project root and configure the required variables:
   ```dotenv
   RPC_URL=<Your Ethereum RPC URL>
   ETHERSCAN_API_KEY=<Your Etherscan API Key>
   DISCORD_WEBHOOK_URL=<Your Discord Webhook URL>
   SEQUENCER_ADDRESS=<Your Sequencer Contract Address>
   ```

4. **Build the Project**
   Compile the TypeScript code into JavaScript:
   ```bash
   npm run build
   ```

---

## **Execution**

### **Run the Application**
To start the application:
```bash
npm start
```

### **Development Mode**
To run the application in development mode (without building):
```bash
npm run dev
```

---

## **Development Tools**

### **Linting**
Check for code quality issues:
```bash
npm run lint
```

### **Prettier**
Check code formatting:
```bash
npm run prettier:check
```
Fix code formatting issues:
```bash
npm run prettier:fix
```

### **Testing**
Run the test suite:
```bash
npm run test
```

---

## **Docker Setup (Optional)**

1. **Build and Run the Docker Container**
   If you prefer to run the application in a Docker container, use the following command:
   ```bash
   npm run docker:rebuild
   ```

   This will:
   - Build a Docker image with the latest project changes.
   - Start a container from the image.

2. **Environment Variables for Docker**
   Pass the `.env` file during the container build. Add the following to the `Dockerfile` or `docker-compose.yml` if needed:
   ```dockerfile
   ENV RPC_URL=<Your Ethereum RPC URL>
   ENV ETHERSCAN_API_KEY=<Your Etherscan API Key>
   ENV DISCORD_WEBHOOK_URL=<Your Discord Webhook URL>
   ENV SEQUENCER_ADDRESS=<Your Sequencer Contract Address>
   ```

---

## **Project Structure**

- `src/`: Source code for the application.
- `dist/`: Compiled JavaScript files (generated after building).
- `.env`: Environment variables (not committed to the repository).
- `Dockerfile`: Configuration for building a Docker image.
- `package.json`: Project metadata and scripts.
- `node_modules/`: Installed dependencies.

---

## **Support**

For any issues or questions, please create an issue in the [repository](https://github.com/<your-repository>/makerdao-automation/issues).

---
