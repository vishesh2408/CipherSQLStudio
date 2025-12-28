import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../Navbar';
import SchemaViewer from '../SchemaViewer';
import EditorPanel from '../EditorPanel';
import ResultTable from '../ResultTable';
import AuthContext from '../context/AuthContext';

const AssignmentAttempt = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [assignment, setAssignment] = useState(null);
    const [code, setCode] = useState("-- Write your SQL here\nSELECT * FROM");
    const [result, setResult] = useState(null);
    const [hint, setHint] = useState("");
    const [executing, setExecuting] = useState(false);
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error', 'unsaved'

    useEffect(() => {
        const fetchAssignmentAndProgress = async () => {
            try {
                // Fetch assignment details
                const { data: assignmentData } = await api.get(`/assignments/${id}`);
                setAssignment(assignmentData);

                // Fetch solved/previous code if user logged in
                if (user) {
                    console.log("User logged in, fetching progress for:", id);
                    const { data: progressData } = await api.get(`/progress?assignmentId=${id}`);
                    console.log("Progress data received:", progressData);

                    if (progressData && progressData.length > 0) {
                        const savedProgress = progressData[0];
                        if (savedProgress.sqlQuery) {
                            console.log("Setting saved code:", savedProgress.sqlQuery);
                            setCode(savedProgress.sqlQuery);
                        }
                    } else {
                        console.log("No saved progress found.");
                    }
                } else {
                    console.log("User not logged in, skipping progress.");
                }
            } catch (err) {
                console.error("Error loading data", err);
            }
        };
        fetchAssignmentAndProgress();
    }, [id, user]);

    // Debounced Auto-Save
    useEffect(() => {
        setSaveStatus('unsaved');
        if (!user || !code) return;

        const timeoutId = setTimeout(async () => {
            // Avoid saving if it's the default reset
            if (code === "-- Write your SQL here\nSELECT * FROM") {
                setSaveStatus('saved');
                return;
            }

            setSaveStatus('saving');
            try {
                await api.post('/progress', {
                    assignmentId: id,
                    sqlQuery: code,
                    isCompleted: false // Just saving draft
                });
                setSaveStatus('saved');
            } catch (e) {
                console.error("Auto-save failed", e);
                setSaveStatus('error');
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timeoutId);
    }, [code, id, user]);

    const handleRun = async () => {
        setExecuting(true);
        setResult(null);
        try {
            // Force save on run as well
            if (user) {
                setSaveStatus('saving');
                await api.post('/progress', {
                    assignmentId: id,
                    sqlQuery: code,
                    isCompleted: false
                });
                setSaveStatus('saved');
            }

            const { data } = await api.post('/execute', { assignmentId: id, sqlQuery: code });
            // Run action: isSubmit is false
            setResult({ ...data, isSubmit: false });
        } catch (err) {
            setResult({ success: false, error: "Execution failed." });
        } finally {
            setExecuting(false);
        }
    };

    const handleSubmit = async () => {
        setExecuting(true);
        setResult(null);
        try {
            const { data } = await api.post('/execute', { assignmentId: id, sqlQuery: code });
            // Add a flag to indicate this results from a submit action
            const submitResult = { ...data, isSubmit: true };
            setResult(submitResult);

            if (submitResult.passed) {
                if (user) {
                    await api.post('/progress', {
                        assignmentId: id,
                        sqlQuery: code,
                        isCompleted: true
                    });
                }
            }
        } catch (err) {
            setResult({ success: false, error: "Execution failed." });
        } finally {
            setExecuting(false);
        }
    };

    const handleGetHint = async () => {
        try {
            const { data } = await api.post('/hint', { assignmentId: id, sqlQuery: code });
            setHint(data.hint);
        } catch (err) {
            console.error("Hint failed", err);
        }
    };

    if (!assignment) return <div className="loading">Loading Challenge...</div>;

    const getSaveMessage = () => {
        switch (saveStatus) {
            case 'saving': return 'Saving...';
            case 'saved': return 'Saved';
            case 'error': return 'Save Failed';
            default: return ''; // unsaved or default
        }
    };

    return (
        <div className="assignment-attempt">
            <Navbar />

            <header className="attempt-subheader">
                <div className="title-area" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1>{assignment.title}</h1>
                    <span style={{ fontSize: '0.8rem', color: saveStatus === 'error' ? '#ff375f' : '#888' }}>
                        {getSaveMessage()}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#666', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>
                        {user ? user.email : 'Guest Mode (Not Saving)'}
                    </span>
                </div>
                <div className="actions">
                    <button className="btn-secondary" onClick={handleGetHint}>Get Hint 💡</button>
                    <button className="btn-secondary" onClick={handleRun} disabled={executing} style={{ marginRight: '10px' }}>
                        {executing ? 'Running...' : 'Run Code ▶'}
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={executing || !user}
                        title={!user ? "Login to submit solution" : "Submit solution"}
                        style={{ opacity: !user ? 0.6 : 1, cursor: !user ? 'not-allowed' : 'pointer' }}
                    >
                        {user ? 'Submit' : 'Login to Submit'}
                    </button>
                </div>
            </header>

            <div className="workspace">
                <div className="left-panel">
                    <div className="panel-section question-box">
                        <h3>Question</h3>
                        <p>{assignment.question}</p>
                    </div>

                    <SchemaViewer tables={assignment.sampleTables} />

                    {assignment.expectedOutput && assignment.expectedOutput.value && (
                        <div className="panel-section expected-output-box">
                            <h3>Expected Output</h3>
                            <div className="table-responsive">
                                <table className="table table-bordered table-dark table-sm">
                                    <thead>
                                        <tr>
                                            {Object.keys(assignment.expectedOutput.value[0] || {}).map(col => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignment.expectedOutput.value.map((row, idx) => (
                                            <tr key={idx}>
                                                {Object.values(row).map((val, i) => (
                                                    <td key={i}>{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {hint && (
                        <div className="panel-section hint-box">
                            <h3>Hint</h3>
                            <p>{hint}</p>
                        </div>
                    )}
                </div>

                <div className="right-panel">
                    <EditorPanel value={code} onChange={setCode} />

                    <div className="results-container">
                        <h3>Results</h3>
                        <ResultTable result={result} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentAttempt;
