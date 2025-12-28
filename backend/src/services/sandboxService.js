const { pgPool } = require('../config/db');

exports.executeSql = async (sqlQuery, setupSql) => {
  const client = await pgPool.connect();

  try {
    await client.query('BEGIN');

    if (setupSql) {
       await client.query(setupSql);
    }

    const forbidden = /DROP|DELETE|TRUNCATE|ALTER|GRANT|REVOKE|INSERT|UPDATE/i;

    const result = await client.query(sqlQuery);

    await client.query('ROLLBACK');

    return {
      success: true,
      rows: result.rows,
      rowCount: result.rowCount,
      columns: result.fields.map(f => f.name)
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
