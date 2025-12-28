import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../Navbar';
import AuthContext from '../context/AuthContext';
import '../styles/main.scss';

const AssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentsRes, progressRes] = await Promise.all([
                    api.get('/assignments'),
                    user ? api.get('/progress') : Promise.resolve({ data: [] })
                ]);

                setAssignments(assignmentsRes.data);

                // Map progress for O(1) lookup
                const pMap = {};
                progressRes.data.forEach(p => {
                    pMap[p.assignmentId] = p.isCompleted;
                });
                setProgressMap(pMap);

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-success';
            case 'medium': return 'text-warning';
            case 'hard': return 'text-danger';
            default: return 'text-muted';
        }
    };

    return (
        <div className="page-wrapper dashboard-layout">
            <Navbar />

            <div className="dashboard-container">
                {/* Left Sidebar */}

                {/* Main Content */}
                {/* Main Content */}
                <main className="problem-list-content">
                    <div className="topic-filters">
                        <button className="filter-chip active">All</button>
                        <button className="filter-chip">Basic SQL</button>
                        <button className="filter-chip">Joins</button>
                        <button className="filter-chip">Aggregation</button>
                        <button className="filter-chip">Subqueries</button>
                        <button className="filter-chip">Advanced</button>
                    </div>

                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search questions by number or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="list-header">
                        <div className="col-status">Status</div>
                        <div className="col-title">Title</div>
                        <div className="col-acceptance">Acceptance</div>
                        <div className="col-difficulty">Difficulty</div>
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading...</div>
                    ) : (
                        <div className="problem-list">
                            {assignments.filter(assignment => {
                                if (!searchQuery) return true;
                                const query = searchQuery.toLowerCase();
                                const titleMatch = assignment.title.toLowerCase().includes(query);
                                // Find original index to verify number matching provided we knew strictly
                                // For now, we'll map first then filter? Or finding index in original array.
                                // simpler: just filter. But to match "1" to "1. Title", we need the index.
                                // Let's filter in the map or create a mapped array first.
                                return true;
                            })
                                .map((assignment, index) => ({ ...assignment, originalIndex: index + 1 })) // Preserve number
                                .filter(item => {
                                    if (!searchQuery) return true;
                                    const query = searchQuery.toLowerCase();
                                    return item.title.toLowerCase().includes(query) ||
                                        item.originalIndex.toString().includes(query);
                                })
                                .map((assignment) => {
                                    const isSolved = progressMap[assignment._id];
                                    return (
                                        <div
                                            key={assignment._id}
                                            className={`problem-row ${assignment.originalIndex % 2 === 0 ? 'row-even' : 'row-odd'}`}
                                            onClick={() => navigate(`/assignment/${assignment._id}`)}
                                        >
                                            <div className="col-status">
                                                {isSolved ? (
                                                    <span className="status-solved">✔</span>
                                                ) : (
                                                    <span className="status-unsolved"></span>
                                                )}
                                            </div>
                                            <div className="col-title">
                                                {assignment.originalIndex}. {assignment.title}
                                            </div>
                                            <div className="col-acceptance">
                                                {(() => {
                                                    const attempts = assignment.stats?.attempts || 0;
                                                    const solved = assignment.stats?.solved || 0;
                                                    if (attempts === 0) return '0%';
                                                    return `${((solved / attempts) * 100).toFixed(1)}%`;
                                                })()}
                                            </div>
                                            <div className={`col-difficulty ${getDifficultyColor(assignment.difficulty)}`}>
                                                {assignment.difficulty}
                                            </div>
                                        </div>
                                    );
                                })}
                            {assignments.length === 0 && <div className="empty-state">No assignments found.</div>}
                        </div>
                    )}
                </main>

                {/* Right Widgets */}
            </div>
        </div>
    );
};

export default AssignmentList;
