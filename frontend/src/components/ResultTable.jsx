const ResultTable = ({ result }) => {
    if (!result) {
        return (
            <div className="placeholder">
                Run a query to see results here
            </div>
        );
    }

    if (!result.success) {
        return <div className="error-message">Error: {result.error}</div>;
    }

    return (
        <div className="table-wrapper">
            {result.isSubmit ? (
                <div className={`status-banner ${result.passed ? 'success' : 'error'}`}>
                    {result.passed ? '✅ All testcases passed!' : `❌ Wrong Answer`}
                    {!result.passed && result.feedback && <div className="feedback-detail">{result.feedback}</div>}
                </div>
            ) : (
                <div className={`status-banner ${result.passed ? 'success' : 'error'}`} style={{ opacity: 0.9 }}>
                    {result.passed ? 'Result: Successful' : 'Result: Failed'}
                    {!result.passed && result.feedback && <div className="feedback-detail">{result.feedback}</div>}
                </div>
            )}

            <div className="output-comparison">
                <div className="actual-output">
                    <h4>Your Output</h4>
                    <table>
                        <thead>
                            <tr>
                                {result.columns && result.columns.map(col => <th key={col}>{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {result.rows && result.rows.map((row, idx) => (
                                <tr key={idx}>
                                    {result.columns.map(col => <td key={col}>{row[col]}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!result.passed && result.expectedOutput && (
                    <div className="expected-output">
                        <h4>Expected Output</h4>
                        <table>
                            <thead>
                                <tr>
                                    {/* Assuming expectedOutput has same structure/keys as rows */}
                                    {Object.keys(result.expectedOutput[0] || {}).map(col => <th key={col}>{col}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {result.expectedOutput.map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.keys(row).map(col => <td key={col}>{row[col]}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="meta">Returned {result.rowCount} rows</div>

            {result.isSubmit && result.passed && (
                <div className="submission-success-footer" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(40, 167, 69, 0.1)',
                    color: '#4caf50',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    border: '1px solid rgba(40, 167, 69, 0.2)'
                }}>
                    Your code is Submitted!
                </div>
            )}
        </div>
    );
};

export default ResultTable;
