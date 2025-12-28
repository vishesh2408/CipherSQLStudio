import { Link } from 'react-router-dom';

const AssignmentCard = ({ assignment }) => {
    return (
        <div className="card assignment-card">
            <span className={`badge ${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
            </span>
            <h2>{assignment.title}</h2>
            <p>{assignment.description}</p>
            <Link to={`/assignment/${assignment._id}`} className="btn-primary">
                Start Challenge
            </Link>
        </div>
    );
};

export default AssignmentCard;
