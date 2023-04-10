
import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { UserContext } from "../../../App"
import { formatDateToYMD } from "../../../helpers/formatDate"
import { Lecture } from "../../adminPages/Viewing/ViewLectures"
import { students } from "../../adminPages/Viewing/ViewStudents"



export default function ViewLectures() {
  const [lectureDetails, setLectureDetails] = useState<Lecture>()
  const { id } = useParams<{ id: string }>()
  const [students, setStudents] = useState<students[]>()
  const [error, setError] = useState('')
  const [studentsError, setStudentsError] = useState('')

  useEffect(() => {
    if (id) {
      fetch('http://localhost/webais/api/lectures?lecture_id=' + id)
        .then(res => res.json())
        .then(result => setLectureDetails(result.lectures[0]))

    }
  }, [id])

  


  return (
    <div className="p-4 flex flex-col items-center">
      <div className="lectureDetails">
        {lectureDetails && error == '' ? (
          <>
            <h3 className="uppercase">{lectureDetails.title} ({lectureDetails.code})</h3>
            <Link to={'/dashboard-lecturer/view-courses/'+lectureDetails.course_id}>
              View Course
            </Link>

            <p> Venue: {lectureDetails.venue}</p>
            <p>Day: {lectureDetails.day}</p>
            <p>Time: {lectureDetails.time} </p>
            <p>Duration: {lectureDetails.duration} hours</p>

          </>
        ) : null}
      </div>
      
      <div className="students">
        {students && studentsError == '' ? (
          <>
            <h4>Students</h4>

          </>
        ) : null}
      </div>
    </div>
  )
}
