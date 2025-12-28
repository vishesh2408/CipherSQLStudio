const SchemaViewer = ({ tables }) => {
    return (
        <div className="panel-section schema-box">
            <h3>Input</h3>
            {tables.map(table => (
                <div key={table.tableName} className="table-schema mb-4">
                    <p><strong>Table:</strong> {table.tableName}</p>
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm table-dark-custom">
                            <thead>
                                <tr>
                                    {table.columns.map(col => (
                                        <th key={col.columnName}>
                                            {col.columnName} <span className="text-muted" style={{ fontSize: '0.8em' }}>({col.dataType})</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows && table.rows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                        {table.columns.map(col => (
                                            <td key={col.columnName}>{row[col.columnName]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SchemaViewer;
