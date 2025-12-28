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
    const [selectedTopic, setSelectedTopic] = useState('All');
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
                        <button
                            className={`filter-chip ${selectedTopic === 'All' ? 'active' : ''}`}
                            onClick={() => setSelectedTopic('All')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-chip ${selectedTopic === 'Basic SQL' ? 'active' : ''}`}
                            onClick={() => setSelectedTopic('Basic SQL')}
                        >
                            Basic SQL
                        </button>
                        <button
                            className={`filter-chip ${selectedTopic === 'Joins' ? 'active' : ''}`}
                            onClick={() => setSelectedTopic('Joins')}
                        >
                            Joins
                        </button>
                        <button
                            className={`filter-chip ${selectedTopic === 'Aggregation' ? 'active' : ''}`}
                            onClick={() => setSelectedTopic('Aggregation')}
                        >
                            Aggregation
                        </button>
                        <button
                            className={`filter-chip ${selectedTopic === 'Subqueries' ? 'active' : ''}`}
                            onClick={() => setSelectedTopic('Subqueries')}
                        >
                            Subqueries
                        </button>
                        <button
                            className={`filter-chip ${selectedTopic === 'Advanced' ? 'active' : ''}`}
                            onClick={() => setSelectedTopic('Advanced')}
                        >
                            Advanced
                        </button>
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
                            {(() => {
                                // Prepare data: Attach original index to all assignments
                                const processedAssignments = assignments.map((a, i) => ({ ...a, originalIndex: i + 1 }));

                                // Apply filters
                                const filtered = processedAssignments.filter(item => {
                                    // Topic Filter
                                    if (selectedTopic !== 'All' && item.topic !== selectedTopic) return false;

                                    // Search Filter
                                    if (searchQuery) {
                                        const query = searchQuery.toLowerCase();
                                        return item.title.toLowerCase().includes(query) ||
                                            item.originalIndex.toString().includes(query);
                                    }
                                    return true;
                                });

                                if (filtered.length === 0) {
                                    // Check if it's because of the topic filter specifically
                                    if (selectedTopic !== 'All' && assignments.filter(a => a.topic === selectedTopic).length === 0) {
                                        return <div className="empty-state">Coming Soon! (No questions in this category yet)</div>;
                                    }
                                    return <div className="empty-state">No assignments found matching your criteria.</div>;
                                }

                                return filtered.map((assignment) => {
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
                                });
                            })()}
                        </div>
                    )}
                </main>

                {/* Right Widgets */}
            </div>
        </div>
    );
};

export default AssignmentList;
