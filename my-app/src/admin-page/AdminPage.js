import React, { useState, useEffect } from 'react'
import QuestionsData from './components/QuestionsData'
import Pagination from './components/Pagination'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import './css/AdminPage.css'
import AddModal from './components/AddModal'
import EditModal from './components/EditModal'
import DeleteModal from './components/DeleteModal'
import Axios from 'axios'

const AdminTable = () => {
    // Setting the states
    const [allQuestions, setAllQuestions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [questionsPerPage, setQuestionsPerPage] = useState(5)
    const [addModalShow, setAddModalShow] = useState(false)
    const [editModalShow, setEditModalShow] = useState(false)
    const [deleteModalShow, setDeleteModalShow] = useState(false)
    const [deleteQuestionID, setDeleteQuestionID] = useState(0)
    const [editQuestion, setEditQuestion] = useState({
        title: '',
        answers: ['', '', '', ''],
        correctAnswer: null,
        _id: 0
    })

    // Fetching the questions
    useEffect(() => {
        const fetchQuestions = async () => {
            const res = await axios.get('http://localhost:5000/questions')
            setAllQuestions(res.data)
        }
        fetchQuestions()
    }, [allQuestions])

    // Get current questions
    const indexOfLastQuestion = currentPage * questionsPerPage
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
    const currentQuestions = allQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)

    // Get total number of questions
    const totalQuestions = allQuestions.length

    // Changing pages
    const paginate = (number) => {
        setCurrentPage(number)
    }

    const nextPage = () => {
        if (currentPage < Math.ceil(totalQuestions / questionsPerPage)) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    // Changing number of questions per page
    const updateQuestionsPerPage = (e) => {
        setQuestionsPerPage(e.target.value)
        setCurrentPage(1)
    }

    // Handling the add modal
    const showAddModal = () => {
        setAddModalShow(true)
    }

    const hideAddModal = () => {
        setAddModalShow(false)
    }

    // Handling the edit modal
    const showEditModal = (id) => {
        setEditModalShow(true)
        const findQuestion = allQuestions.find(question => {
            return id === question._id
        })
        setEditQuestion(findQuestion)
    }

    const hideEditModal = () => {
        setEditModalShow(false)
    }

    const handleUpdateQuestion = () => {
        Axios.put('http://localhost:5000/questions/update/' + editQuestion._id, editQuestion)
            .then(res => {
                hideEditModal()
                return res
            })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    // Updating answers
    const handleChange = (event) => {
        switch (event.target.name) {
            case 'question':
                setEditQuestion({
                    ...editQuestion,
                    title: event.target.value
                })
                break
            case 'answer0':
                setEditQuestion({
                    ...editQuestion,
                    answers: editQuestion.answers.map((answer, index) => {
                        if (index === 0) {
                            return event.target.value
                        } else {
                            return answer
                        }
                    })
                })
                break
            case 'answer1':
                setEditQuestion({
                    ...editQuestion,
                    answers: editQuestion.answers.map((answer, index) => {
                        if (index === 1) {
                            return event.target.value
                        } else {
                            return answer
                        }
                    })
                })
                break
            case 'answer2':
                setEditQuestion({
                    ...editQuestion,
                    answers: editQuestion.answers.map((answer, index) => {
                        if (index === 2) {
                            return event.target.value
                        } else {
                            return answer
                        }
                    })
                })
                break
            case 'answer3':
                setEditQuestion({
                    ...editQuestion,
                    answers: editQuestion.answers.map((answer, index) => {
                        if (index === 3) {
                            return event.target.value
                        } else {
                            return answer
                        }
                    })
                })
                break
            case 'correctAnswer':
                setEditQuestion({
                    ...editQuestion,
                    correctAnswer: parseInt(event.target.value)
                })
                break
            default:
                break
        }
    }


    // Handling the delete modal
    const showDeleteModal = (id) => {
        setDeleteModalShow(true)
        setDeleteQuestionID(id)
    }

    const hideDeleteModal = () => {
        setDeleteModalShow(false)
    }

    return (
        <div className="table-container">
            <div className="table-content">
                <div className="table-title">
                    <h1>Welcome back, Thang!</h1>
                    <button className="logout-button">Log Out</button>
                </div>
                <div className="table-option">
                    <label>Show
                    <select className="select-box" value={questionsPerPage} onChange={updateQuestionsPerPage}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>questions per page
                </label>
                    <button className="add-button" onClick={showAddModal}>Add</button>
                </div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Questions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQuestions.map(question =>
                            <QuestionsData question={question} key={question._id} showDeleteModal={showDeleteModal} showEditModal={showEditModal} />
                        )}
                    </tbody>
                </Table>
                <Pagination
                    totalQuestions={totalQuestions}
                    questionsPerPage={questionsPerPage}
                    paginate={paginate}
                    indexOfFirstQuestion={indexOfFirstQuestion}
                    indexOfLastQuestion={indexOfLastQuestion}
                    currentPage={currentPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    currentQuestionsNumber={currentQuestions.length}
                />
            </div>
            <AddModal show={addModalShow} onHide={hideAddModal} />
            <EditModal show={editModalShow} onHide={hideEditModal} editQuestion={editQuestion} handleChange={handleChange} handleUpdateQuestion={handleUpdateQuestion} />
            <DeleteModal show={deleteModalShow} onHide={hideDeleteModal} deleteQuestionID={deleteQuestionID} currentQuestionsNumber={currentQuestions.length} prevPage={prevPage} />
        </div>
    )
}

export default AdminTable