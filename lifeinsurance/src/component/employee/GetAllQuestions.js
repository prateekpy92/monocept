import React, { useEffect, useState } from 'react';
import { getAllQuestions } from '../../services/employee/Employee';
import PaginationApp from '../shared/page/PaginationApp';
import PageSizeSetter from '../shared/page/PageSizeSetter';
import Tab from '../shared/table/Table'; // Import the Tab component
import Modal from 'react-modal';
import axios from 'axios';

// Modal styles for better UI
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
  },
};

Modal.setAppElement('#root'); // This ensures accessibility

const GetAllQuestions = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState();
  const [totalElements, setTotalElements] = useState();
  const [data, setData] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState(''); // State for storing the answer input

  const getAllQuestionsData = async () => {
    try {
      let response = await getAllQuestions(pageNumber, pageSize);
      setData(response.data.content);
      setTotalPages(Math.ceil(parseInt(response.headers['question-count']) / pageSize));
      setTotalElements(parseInt(response.headers['question-count']));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleUpdate = (questionId) => {
    setSelectedQuestionId(questionId);
    setShowAnswerForm(true);
  };

  const handleCloseForm = () => {
    setShowAnswerForm(false);
    setSelectedQuestionId(null);
    setAnswer(''); // Clear the answer field when the modal is closed
  };

  
  const handleAnswerSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/insuranceapp/question/${selectedQuestionId}/answer`, 
        {}, // Empty request body since you're passing data via params
        {
          params: {
            answer, // Pass the answer as a query parameter
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('auth'), // Add Authorization token from localStorage
          },
        }
      );
  
      if (response.status === 200) {
        alert('Answer submitted successfully!');
        handleCloseForm(); // Close the form after submission
        getAllQuestionsData()
      } else {
        alert('Failed to submit answer.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('An error occurred while submitting the answer.');
    }
  };
  
  

  useEffect(() => {
    getAllQuestionsData();
  }, [pageNumber, pageSize]);

  return (
    <>
      <Modal
        isOpen={showAnswerForm}
        onRequestClose={handleCloseForm}
        style={customStyles}
        contentLabel="Answer Question Modal"
      >
        <h2>Respond to Question</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label htmlFor="questionId" className="form-label">
              Question ID
            </label>
            <input
              type="text"
              className="form-control"
              id="questionId"
              value={selectedQuestionId || ''}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="answer" className="form-label">
              Your Answer
            </label>
            <textarea
              className="form-control"
              id="answer"
              rows="3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" onClick={handleAnswerSubmit}>
            Submit
          </button>
          <button className="btn btn-secondary ms-2" onClick={handleCloseForm}>
            Cancel
          </button>
        </form>
      </Modal>

      <div className='container'>
        <div className='row my-5'>
          <div className='col-4'>
            <PaginationApp
              totalPages={totalPages}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
              pageNumber={pageNumber}
            />
          </div>
          <div className='col-2 offset-2'>
            <PageSizeSetter
              totalElements={totalElements}
              setPageSize={setPageSize}
              setTotalpage={setTotalPages}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Tab
              data={data}
              isUpdateButton={false}
              isDeleteButton={false}
              isPlans={false}
              showMoreButton={false}
              isPayment={false}
              isDoc={false}
              isNominee={false}
              isClaim={false}
              isPay={false}
              isAproov={false}
              isReject={false}
              deleteFun={null}
              UpdateFun={null}
              detailFun={null}
              nomineeFun={null}
              claimFun={null}
              paymentFun={null}
              docFun={null}
              planToggleFun={null}
              Answer={true} // Enable answer-related functionality
              answerFun={handleUpdate} // Use handleUpdate to open the answer form
            />
          </div>
        </div>
      </div>
      {data.length === 0 && (
        <div className='text-center fw-bold text-danger fs-1'>No Question Found</div>
      )}
    </>
  );
};

export default GetAllQuestions;
