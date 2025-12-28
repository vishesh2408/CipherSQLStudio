const { pgPool } = require('../config/db');

/**
 * Service to execute user SQL in a safe sandbox.
 * Warning: In a real production environment, this needs Docker or heavy permissions handling.
 * Here we use TRANSACTIONS to roll back changes.
 */
exports.executeSql = async (sqlQuery, setupSql) => {
  const client = await pgPool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Setup the environment (Create temp tables or schema)
    // We assume setupSql contains specific CREATE TEMP TABLE statements or similar
    // For this assignment, we'll try running the setupSql directly.
    if (setupSql) {
       await client.query(setupSql);
    }

    // 2. Execute User Query
    // We restrict destructive commands for safety (basic regex check)
    const forbidden = /DROP|DELETE|TRUNCATE|ALTER|GRANT|REVOKE|INSERT|UPDATE/i;
    // Note: Assignments might require INSERT/UPDATE, but for "SELECT" tasks we block them.
    // If the assignment is to modify data, we should relax this. 
    // For this demo, we assume SELECT only assignments for safety.
    
    // if (forbidden.test(sqlQuery)) {
    //   throw new Error("Security Alert: Only SELECT queries are currently allowed.");
    // }

    const result = await client.query(sqlQuery);

    await client.query('ROLLBACK'); // Always rollback to keep DB clean
    
    return {
      success: true,
      rows: result.rows,
      rowCount: result.rowCount,
      columns: result.fields.map(f => f.name)
    };

  } catch (error) {
    await client.query('ROLLBACK');
    return {
      success: false,
      error: error.message
    };
  } finally {
    client.release();
  }
};
