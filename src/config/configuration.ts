export const configuration = () => {
    const required = [
      'NODE_ENV',
      'FRONTEND_URL',
      'DATABASE_URL',
      'CV_SERVICE_URL',
    ];

    for (const key of required) {
        if(!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }

    const nodeEnv = process.env.NODE_ENV;
    if(nodeEnv !== 'development' && nodeEnv !== 'production' && nodeEnv !== 'test') {
        throw new Error(
          `NODE_ENV must be 'development' or 'production', got: ${nodeEnv}`,
        );
    }

    return {
      port: parseInt(process.env.PORT ?? '3001', 10),
      nodeEnv,
      frontendUrl: process.env.FRONTEND_URL,
      databaseUrl: process.env.DATABASE_URL,
      cvServiceUrl: process.env.CV_SERVICE_URL,
      cvServiceTimeoutMs: parseInt(
        process.env.CV_SERVICE_TIMEOUT_MS ?? '15000',
        10,
      ),
      uploadsPath: process.env.UPLOADS_PATH ?? './uploads/batches',
      maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '5', 10),
    };
}